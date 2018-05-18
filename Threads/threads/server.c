/* 
Server.c
David Ellenberger
OS | Spring 18
Base project + some additional HTTP request types - GET, POST, and HEAD
*/



#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>
#include <ctype.h>
#include <time.h>
#include <pthread.h>


#define MAXBUFF 100
#define MAXCHAR 1000
#define NWORKERS 10

int request_id = 0;

// Mutex stuff
pthread_mutex_t qMutex;
pthread_cond_t qEmpty;

// Log stuff
char *logFilePath = "./log.txt";
FILE *logFilePtr;

int serverd;

// Make http stuff
char HTTP200[]="HTTP/1.1 200 OK\r\n";
char HTTP400[]="HTTP/1.1 400 Bad Request\r\n";
char HTTP404[]="HTTP/1.1 404 Not Found\r\n";
char HTTP501[]="HTTP/1.1 501 Not Implemented\r\n";
char DateString[40]="Date:  ";
char Connection[]="Connection: close\r\n";
char ContentType[]="Content-Type: text/html; charset=utf-8\r\n";
char ContentLength[50]="Content-Length:  ";
char CrLf[]="\r\n";

// For timestamps
static const char *DAY_NAMES[] = { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };
static const char *MONTH_NAMES[] = { "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

// Function to create timestamp. found on stack overflow because mine wasn't working 
char *Rfc1123_DateTimeNow()
{
  int RFC1123_TIME_LEN = 29;
  time_t t;
  struct tm tm;
  char * buf = malloc(30);
  time(&t);
  gmtime_r(&t, &tm);
  strftime(buf, RFC1123_TIME_LEN+1, "---, %d --- %Y %H:%M:%S GMT", &tm);
  memcpy(buf, DAY_NAMES[tm.tm_wday], 3);
  memcpy(buf+8, MONTH_NAMES[tm.tm_mon], 3);
  return buf;
}

// For extra feature: handling multiple request types
typedef enum {
  GET = 1, //main
  HEAD,
  POST,
   ERROR
} request_t;

// Define struct for thread and socket info
struct tdata{
  int ssockd;
  int csockd;
  int request_id;
  int *next_request_idp;
  pthread_t thread_id;  
  int thread_num;
  int clientd;
  int server_tid;
  struct tdata_struct *link;
};

// Build work queue - list of tdata
// Currently broken? 
struct work_queue {
  struct tdata *start; // address of first tdata in queue
  struct tdata **end; //addr of final link in queue
} work_queue;


/* addq
  1 argument: address of a tdata item
  State change: The tdata item arg1 is appended to the end of
  work_queue, adjusting work_queue's members to reflect the new item
  Return: none */
void addq(struct tdata *tdatap) {
  printf("in addq\n");
  pthread_mutex_lock(&qMutex);
  if (work_queue.end == &work_queue.start)
    pthread_cond_broadcast(&qEmpty);
  *work_queue.end = tdatap;
  tdatap->link = 0;
  work_queue.end = &tdatap->link;
  pthread_mutex_unlock(&qMutex);
  return;
}

/* removeq
  No arguments
  State change: If work_queue contains at least one item,
  remove the first item from work_queue, adjusting work_queue
  to reflect that removal.
  Return: The address of the removed struct tdata item, or 0 if
  work_queue was empty. */
struct tdata *removeq() {
  pthread_mutex_lock(&qMutex);
  while (work_queue.start == 0)
    /* assert: there are no elements in work_queue */
    pthread_cond_wait(&qEmpty, &qMutex);
  /* assert: there is at least one element in work_queue */
  struct tdata *tmp = work_queue.start;
  work_queue.start = tmp->link;
  if (work_queue.start == 0)
    /* assert: no remaining elements in work_queue */
    work_queue.end = &work_queue.start;
  pthread_mutex_unlock(&qMutex);
  tmp->link = 0;
  return tmp;
}

// Here's the big one
// process a request to send
static void* process_request(void *tmparg) 
{
  //hold our temporary argument in a tdata
  struct tdata *tdata = tmparg;

  // setup base info
  request_t httpcommand; // For extra feature - will hold request type
  char pathname[MAXBUFF];
  char protocol[MAXBUFF];
  struct stat pathname_stat;
  FILE *file;
  int clientd = tdata->clientd;
  char buff[MAXBUFF];  // same buffer idea as before
  int ret;  // for holding return values of calls

  // debugging
  printf("Current thread clientd is: %d, with tdata client id %d\n",clientd, tdata->clientd);

  // Build loop for handling requests tha will coninue until killed.
  while (1) {
    int i = 0;
    do { 
      // get value from the clientd
      if ((ret = recv(clientd, buff, MAXBUFF-1, 0)) < 0) {
	perror("recv()");
	printf("clientd=%d\n",clientd);
	pthread_exit(NULL);
      }

      buff[ret] = '\0';  // add nullbyte to end. Forgot this earlier and was being very annoying
      printf("Received message (%d chars):\n%s", ret, buff);
      // begin parsing by line
      if (i== 0 && ret !=0) 
	{
	  printf("first line ret val is %d\n",ret);
	  char *buffptr = buff;
	  char *pathnameptr = pathname;;
	  char *protocolptr = protocol;;

	  // advance to first non-space character
	  while (isspace(*buffptr) && *buffptr != '\0') 
	    buffptr++;
          // To handle get, head and post requests
	  if (strncmp(buffptr,"GET ",4) == 0){
	    buffptr += 4;
	    httpcommand = GET;  
	    } else if (strncmp(buffptr,"HEAD ",5) == 0){
		buffptr += 5;
		httpcommand = HEAD;
	    } else if (strncmp(buffptr,"POST ",5) == 0){
		buffptr += 6;               
		httpcommand = POST;
	    } else
		httpcommand = ERROR;
	  // now do stuff with them
	  if (httpcommand == GET||httpcommand == HEAD||httpcommand== POST) {
	    while (isspace(*buffptr) && *buffptr != '\0') //deal w/ space 
	      buffptr++;
	    while (!isspace(*buffptr) && *buffptr != '\0')
	      *pathnameptr++ = *buffptr++;
	    *pathnameptr='\0';
	    //check we're on the right path
	    printf("current pathname is %s\n",pathname);
	    while (isspace(*buffptr) && *buffptr != '\0') //do it again w/ protocol pointer 
	      buffptr++;
	    while (!isspace(*buffptr) && *buffptr != '\0')
	      *protocolptr++ = *buffptr++;
	    *protocolptr = '\0';
	    printf("protocol==%s\n",protocol);
	    fflush(stdout);
	  }
	}
                    
      i++;
    } while ((i < 4) && (buff[0] != '\n') && (ret != 0));

    //Kill when client's not going
    if (ret == 0) break;
    //printf("Wait no come back!\n");

    char cu[MAXBUFF];
    //If the command is get or head, print the pathname and open the pathname file
    if (httpcommand == GET) {
      printf("current pathname is %s\n",pathname);
      file = fopen(pathname, "rw");
      // If it exists, send an all good message, else file not found
      if(file)
        send(clientd, HTTP200, strlen(HTTP200), 0);
      else
        send(clientd, HTTP404, strlen(HTTP404), 0);
    }
    if(httpcommand == HEAD){
      printf("current pathname is %s\n",pathname);
      file = fopen(pathname, "rw");
      // Same as before, send an all good message, else file not found
      if(file)
        send(clientd, HTTP200, strlen(HTTP200), 0);
      else
        send(clientd, HTTP404, strlen(HTTP404), 0);
    } 
    // Struggled to get post going
    //if(httpcommand == POST){

    if (httpcommand == ERROR) // Send 400 if error
      send(clientd, HTTP400, strlen(HTTP400), 0);

    // make and send timestamp
    // built from function above
    char *gmtdate = Rfc1123_DateTimeNow();
    memcpy(&DateString[7],gmtdate,29);
    // append \r\n
    DateString[36]='\r';
    DateString[37]='\n';
    send(clientd, DateString, strlen(DateString), 0);
    send(clientd, Connection, strlen(Connection), 0);
    send(clientd, ContentType, strlen(ContentType), 0);
    stat(pathname, &pathname_stat);
    char *tmpContentLength = malloc(50);

    if (httpcommand == GET || httpcommand == HEAD)
      sprintf(tmpContentLength,"%s %lld\r\n",ContentLength,pathname_stat.st_size);
    else
      sprintf(tmpContentLength,"%s\r\n",ContentLength);
    
    send(clientd, tmpContentLength, strlen(tmpContentLength), 0);
    send(clientd, CrLf, strlen(CrLf), 0);

    // Send file by line
    if(file && httpcommand == GET){
      int lineLen;
      while(fgets(cu, MAXBUFF, file)){
	lineLen = strlen(cu)-1;
	cu[lineLen++]='\r';
	cu[lineLen++]='\n';
	send(clientd, cu, lineLen, 0);
        }
    }
}

    // lock mutex
    pthread_mutex_lock(&qMutex);
    
    // write all all our stuff to our log file
    //fprintf(logFilePtr,"%d %d %s\n",request_id,tdata->server_tid,gmtdate);
    fprintf(logFilePtr,"%d %s\n",request_id,protocol);
    fprintf(logFilePtr,"%d HTTP/1.1\n",request_id);
    request_id++;

    // unlock mutex
    pthread_mutex_unlock(&qMutex); 

    
    // Get ready to close it down
    struct tdata *tdataptr;
    if ((ret = close(clientd)) < 0) {
      perror("close(clientd)");
      tdataptr = removeq();
      if (tdataptr != 0) 
	free(tdataptr);
      // close thread
      pthread_exit(NULL);
  }

  tdataptr = removeq();
  if (tdataptr != 0) free(tdataptr);
  return 0;
  //wow
}


  // Implement server side handling for threads
static void* handler(void *arg)
  {
    struct sockaddr_in ca;
    socklen_t addrlen;
    int server_tid = *(int *)arg;
    int clientd;
    struct tdata *new_tdata;
    pthread_t thread_id;
    void *res;

    printf("server id is %d,and server tid is %d\n",serverd,server_tid);
    while (1) {
      printf("calling server id = %d\n",serverd);
      // lock the mutex
      pthread_mutex_lock(&qMutex);
      //try to connect to client
      if ((clientd = accept(serverd, (struct sockaddr*) &ca, &addrlen)) < 0) {
	perror("accept()");
        printf("SUCCESS! now connected to clientd=%d\n\n",clientd);
	pthread_exit(NULL);
      }
      // now unlock the mutex
      pthread_mutex_unlock(&qMutex);
      
      // deal w/ new_tdata
      new_tdata=malloc(sizeof(struct tdata));
      new_tdata->clientd = clientd;
      printf("Attempting to call addq\n");
      addq(new_tdata);

      printf("Hopefully calling pthread_create for clientd=%d\n",clientd);
      printf("Now pthread_create on new_tdata->clientd = %d\n",new_tdata->clientd);
      if (pthread_create ( &thread_id , NULL ,  &process_request , new_tdata) < 0)
	{
	  perror("RIP cn't make thread");
	  pthread_exit(NULL);
	}
      // join em
      pthread_join(thread_id, &res);
      // close em up doc
      close(clientd);
    }
  }



int main(int argc, char **argv) {
  char *prog = argv[0];
  int port;
  int serverd;  /* socket descriptor for receiving new connections */
  int ret;

  if (argc < 2) {
    printf("Usage:  %s port\n", prog);
    return 1;
  }
  port = atoi(argv[1]);

  
  // init workqueue stuff
  work_queue.start = 0;
  work_queue.end = &work_queue.start;



  if ((serverd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
    printf("%s ", prog);
    perror("socket()");
    return 1;
  }

  // Begin logging 
  //char toLogFile[MAXCHAR];
  logFilePtr = fopen(logFilePath, "ab+");
  if(logFilePtr == NULL){
    printf("IOERROR: can't access log.txt \n");
    return 1;
  }
  
  struct sockaddr_in sa;
  sa.sin_family = AF_INET;
  sa.sin_port = htons(port);
  sa.sin_addr.s_addr = INADDR_ANY;

  if (bind(serverd, (struct sockaddr*) &sa, sizeof(sa)) < 0) {
    printf("%s ", prog);
    perror("bind()");
    return 1;
  }
  if (listen(serverd, 5) < 0) {
    printf("%s ", prog);
    perror("listen()");
    return 1;
  }

  
  // begin multithreading
  // thandles is arr of len 10, to be filled with thread handles
  pthread_t t_handles[NWORKERS];
  struct sockaddr_in c_add;
  socklen_t addrlen;
  addrlen = sizeof(c_add);
  int t_id[NWORKERS];
  int i=0;
  for(i; i<10; i++){
    t_id[i] = i;
    printf("on thread %d",i);
    //pthread_create(&id[i], 0, &handler, (void *)&handles[i]);
    pthread_create(&t_handles[i], 0, &handler, (void *)&t_id[i]);
    printf("new thread added\n");
  }

  pause();    // <- should wait for handles to finish

  //int clientd;  /* socket descriptor for communicating with client */
  //struct sockaddr_in ca;
  //int size = sizeof(struct sockaddr);

  
  //printf("Waiting for a incoming connection...\n");
  //if ((clientd = accept(serverd, (struct sockaddr*) &ca, &size)) < 0) {
    //printf("%s ", prog);
    //perror("accept()");
    //return 1;
    //}


  //if ((ret = close(serverd)) < 0) {
    //printf("%s ", prog);
    //perror("close(serverd)");
    //return 1;
    //}

  //shut it all down when finished
  fclose(logFilePtr);

  if ((ret = close(serverd)) < 0) {
    printf("%s ", prog);
    perror("close(serverd)");
    return 1;
  }

  return 0;
}
