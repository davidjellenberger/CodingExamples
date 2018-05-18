import java.io.*;
import java.net.*;

/** Utility for testing the <code>Backend</code> and related classes from the
 *  command line.
 *  @author Matthew Johnson */
public class Client {
  /** Size of buffer for reading text from <code>stdin</code> */
  static final int MAX_LINE = 1024;

  /** Connect to the specified hostname and port (given as command line
   *  arguments) using <code>Message</code>s, until a <code>Message</code>
   *  with type EOT is sent.
   *  @param args A <code>String</code> array given the hostname and port to
   *    connect to as the first and second entries, respectively. */
  public static void main(String[] args) {
    String host = null;
    try {
      host = args[0];
    } catch (ArrayIndexOutOfBoundsException e) {
      System.err.println("No hostname provided");
      System.exit(1);
    }
    int port = 0;
    try {
      port = Integer.parseInt(args[1]);
    } catch (ArrayIndexOutOfBoundsException e) {
      System.err.println("No port provided");
      System.exit(1);
    } catch (NumberFormatException e) {
      System.err.println("Port not specified as a number");
      System.exit(1);
    }
    System.out.println("Initializing network communication...");
    System.out.println("host: " + host + "\tport: " + port);
    try (Socket socket = new Socket(host, port);
         InputStream inStream = socket.getInputStream();
         OutputStream outStream = socket.getOutputStream()) {
      int typeCount, contentCount;
      byte[] typeBuff = new byte[MAX_LINE];
      byte[] contentBuff = new byte[MAX_LINE];
      String type, content;
      Message response;
      // until the user enters a type "EOT" repeatedly prompt for message type
      // and content, send Message to the server, and wait for some sort of response
      do {
        System.out.println("Message type (EOT to terminate):");
        typeCount = System.in.read(typeBuff);
        System.out.println("Message content:");
        contentCount = System.in.read(contentBuff);
        // remove leading/trailing whitespace
        type = new String(typeBuff, 0, typeCount).trim();
        content = new String(contentBuff, 0, contentCount).trim();
        (new Message(type, content)).send(outStream);
        response = new Message(inStream);
        System.out.println(response.toString());
        // TODO: check for ACK
      } while (!type.equals("EOT"));
    } catch (IOException e) {
      System.err.println(e.getMessage());
    }
  }
}
