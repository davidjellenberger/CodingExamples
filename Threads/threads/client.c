/* 
Client.c
David Ellenberger
OS | Spring 18
*/

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>
#include <string.h>
#include <time.h>
#include <sys/stat.h>


#define MAXBUFF 100

int main(int argc, char **argv) {
  char *prog = argv[0];
  char *host;
  int port;
  int sd;  /* socket descriptor */
  int ret;  /* return value from a call */
  struct timeval timeout;

  char request[1000];
  char *firstHalf;
  char *secondHalf;

  if (argc < 3) {
    printf("Usage:  %s host port\n", prog);
    return 1;
  }
  host = argv[1];
  port = atoi(argv[2]);

  if ((sd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
    printf("%s ", prog);
    perror("socket()");
    return 1;
  }
  struct hostent *hp;
  struct sockaddr_in sa;
  if ((hp = gethostbyname(host)) == NULL) {
    printf("%s ", prog);
    perror("gethostbyname()");
    return 1;
  }
  memset((char *) &sa, '\0', sizeof(sa));
  memcpy((char *) &sa.sin_addr.s_addr, hp->h_addr, hp->h_length);

  /* bzero((char *) &sa, sizeof(sa));*/
  sa.sin_family = AF_INET;
  /* bcopy((char*) sa->h_addr, (char *) &sa.sin_addr.s_addr, hp->h.length */
  sa.sin_port = htons(port);
  
  if ((ret = connect(sd, (struct sockaddr *) &sa, sizeof(sa))) < 0) {
    printf("%s ", prog);
    perror("connect()");
    return 1;
  }
  printf("Connected.\n");
  
  // setup exit prompt
  printf("Type 'q' or 'quit' to quit\n");
  bool quit = false;

  char *buff = NULL;  /* message buffer */
  char *serverBuff = NULL; // for server response
  size_t bufflen = 0;  /* current capacity of buff */
  size_t nchars;  /* number of bytes recently read */
  
  while(1){
  // Set up GET request
  //firstHalf = "./test.txt";
  //secondHalf = "rns202-1.cs.stolaf.edu";
  //bzero(request, 1000);
  //printf(request,"Get %s HTTP/1.1\r\nHost: %s\r\n", firstHalf, secondHalf);
  //sprintf(request,"Get %s HTTP/1.1\r\nHost: %s\r\n\r\n\r\n", firstHalf, secondHalf);
  //printf("GET request is:\n%s", request);

  //printf("Enter a one-line message to send (max %d chars):\n", MAXBUFF-1);
  //if ((nchars = getline(&buff, &bufflen, stdin)) < 0) {
  //printf("Error or end of input -- aborting\n");
  //return 1;
  //}
  bool end = false;
  do {
    buff = NULL;
    printf("Say what? ");
    if ((nchars = getline(&buff, &bufflen, stdin)) < 0) {
      printf("No input - aborting \n");
      return 1;
    }
    if (strncmp(buff,"quit",4)==0 || strncmp(buff,"q", 1)==0)
      quit = true;
    else   // send it
      if ((ret = send(sd, buff, nchars, 0)) < 0) {
	perror("send()");
	return 1;
      }
    if (buff[0] == '\n') 
      end = true;
    free(buff);
  } while (quit == false && end == false);
  // exit on quit
  if (quit) 
    break;
  
  // set up server response buffer
  serverBuff = (char *)malloc(MAXBUFF*sizeof(char));

  // Receives reply from the server
  do {
    ret = recv(sd, serverBuff, MAXBUFF-1, 0);
    if (ret <= 0 ) break;
    serverBuff[ret] = '\0';
    printf("%s",serverBuff);
  } while(1);

  printf("\n");
  if (ret <= 0) break;

  }
  
  /* 
  if ((ret = send(sd, buff, nchars-1, 0)) < 0) {
    printf("%s ", prog);
    perror("send()");
    return 1;
  } 
*/

  // TODO take buff in and make if fisrt half. user inp
  //if ((ret = send(sd, request, 1000, 0)) < 0) {
  //  printf("%s ", prog);
  //  perror("send()");
  //  return 1;
  //}

  //printf("%d characters sent\n", ret);
 
  // Wait for file to come back line by line
  //char retFileBuff[MAXBUFF]; // New buffer to hold the line hopefully send by server
  //int i=0;
  //while(i<4){
  //  if ((ret = recv(sd, retFileBuff, MAXBUFF-1, 0)) < 0) {
  //    perror("recv()");
  //    //return 1;
      //break;
  //  }
  //  printf("%d characters read RET\n",ret);
  //  retFileBuff[ret] = '\0';
  //  printf("%s ", retFileBuff);
  // memset(retFileBuff, 0, MAXBUFF); 
  // i++;
    //return 1;
  //}

  if ((ret = close(sd)) < 0) {
    printf("%s ", prog);
    perror("close()");
    return 1;
  }
   
  return 0;
}
