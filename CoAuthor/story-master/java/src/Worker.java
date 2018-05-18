import java.io.*;
import java.net.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonStructure;
import javax.json.JsonException;
import javax.json.stream.JsonParsingException;

/** Utility class to handle communications on a given Socket asynchronously
 *  from the main thread. Processes receiveds until a terminating received is
 *  received.
 *  @author Matthew Johnson */
public class Worker implements Runnable {
  /** <code>Socket</code> for which this <code>Worker</code> is responsible. */
  Socket sock;
  /** Printable representation of the address this <code>Worker</code>'s <code>
   *  Socket</code> is connected to. */
  String address;
  /** <code>WorkerData</code> for sharing data with other <code>Worker</code>
   *  objects. */
  WorkerData sharedData;

  /** Creates a <code>Worker</code> that will handle communications on the given
   *  <code>Socket</code>.
   *  @param socket <code>Socket</code> on which this instance should listen.
   *  @param data Object containing data common to many workers. */
  public Worker(Socket socket, WorkerData data) {
    sock = socket;
    sharedData = data;
    address = sock.getInetAddress().toString();
  }

  /** Receive <code>Message</code>s on this instance's <code>Socket</code> until
   *  one with type EOT is received, responding to each appropriately. Currently,
   *  the only meaningful types are JSON/SQL (a SQL request specified in a JSON
   *  object; see <code>JsonWrangler</code> for more details), SQL (a raw SQL
   *  statement; disabled in production), and EOT (exits gracefully). */
  @Override
  public void run() {
    try (InputStream inStream = sock.getInputStream();
         OutputStream outStream = sock.getOutputStream()) {
      Message received = null;
      Message ack = new Message("ACK", "");
      Message nack = new Message("NACK", "");

      Connection connection = sharedData.getDBConnection();
      do {
        received = new Message(inStream);
        System.out.println(address + " received:\n"
                             + received.toString());
        boolean success = true;
        switch (received.getType()) {
          /*
          case "SQL":
            // Message is a raw SQL statement.
            // Debug only. Don't allow raw SQL in production!
            try (Statement statement = connection.createStatement()) {
              // the client is, of course, trust worthy
              ResultSet selection = statement.executeQuery(received.getContent());
              JsonArray array = JsonWrangler.jsonifyResultSet(selection);
              String jsonString = JsonWrangler.jsonToString(array);
              System.out.println(jsonString);
              (new Message("ACK", jsonString)).send(outStream);
            } catch (SQLException e) {
              System.err.println(e.getMessage());
              success = false;
              nack.send(outStream);
            }
            break;
          */
          case "JSON/SQL":
            /* Message is a SQL request described in JSON. Use <code>JsonWrangler
             * </code> to convert the JSON to SQL, execute it, then respond with
             * the results or an error. */
            JsonStructure json = null;
            PreparedStatement statement = null;
            try {
              json = JsonWrangler.stringToJson(received.getContent());
              statement = JsonWrangler.prepareSqlFromJson(connection, (JsonObject)json);
              // if prepareSqlFromJson fails, statement will still be null
              boolean hasResultSet = statement.execute();
              if (hasResultSet) {
                // if statement was a query, convert results into JSON array
                ResultSet selection = statement.getResultSet();
                JsonArray array = JsonWrangler.jsonifyResultSet(selection);
                String jsonString = JsonWrangler.jsonToString(array);
                System.out.println(jsonString);
                (new Message("ACK", jsonString)).send(outStream);
              } else {
                // if statement was insert/update/etc response is just a number
                int updateCount = statement.getUpdateCount();
                String countString = String.valueOf(updateCount);
                System.out.println(countString);
                (new Message("ACK", countString)).send(outStream);
              }
            } catch (IllegalArgumentException e) {
              System.err.println(e.getMessage());
              success = false;
              (new Message("NACK", e.getMessage())).send(outStream);
            } catch (NullPointerException|SQLException|JsonException e) {
              System.err.println(e.getMessage());
              success = false;
              (new Message("NACK", "Error or malformed request")).send(outStream);
            }
            break;
          default:
            ack.send(outStream);
            break;
        }
        /*
        if (success) {
          ack.send(outStream);
        } else {
          nack.send(outStream);
        }
        */
      } while (!received.getType().equals("EOT"));
    } catch (IOException e) {
      System.err.println(e.getMessage());
    } finally {
      try {
        sock.close();
      } catch (IOException e) {
        System.out.println(e.getMessage());
      }
    }
  }
}
