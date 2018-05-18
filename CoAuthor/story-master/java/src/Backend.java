import java.io.*;
import java.net.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ResourceBundle;
import java.util.MissingResourceException;

/** Primary backend server for the Story app. Accepts connections on a specified
 *  port and spawn <code>Worker</code> processes to communicate on these connections.
 *  @author Matthew Johnson */
public class Backend {
  /** Connection to the app's database. */
  static Connection dbConnection;

  /** Data to be shared among the <code>Worker</code> objects spawned. */
  static private WorkerData data;

  /** Connect to the database specified by the parameters in the given resource
   *  bundle file. A value should be defined for each of jdbc.{driver,url,dbname,user,password}.
   *  @param bundleBasename Name of the resource bundle file describing database
   *    connection settings.
   *  @throws MissingResourceException
   *  @throws ClassNotFoundException
   *  @throws SQLException */
  static void ConnectToDatabase(String bundleBasename)
    throws MissingResourceException, ClassNotFoundException, SQLException {
    ResourceBundle config = ResourceBundle.getBundle(bundleBasename);
    String driver = config.getString("jdbc.driver");
    String url = config.getString("jdbc.url");
    String dbName = config.getString("jdbc.dbname");
    String user = config.getString("jdbc.user");
    String password = config.getString("jdbc.password");
    Class.forName(driver);
    dbConnection = DriverManager.getConnection(url + dbName, user, password);
  }

  /** Listen on the specified port and spawn processes to communicate on the
   *  accepted connections.
   *  @param args <code>String[]</code> where the first element is the port
   *    to which the Backend should listen. */
  public static void main(String[] args) {
    if (args.length == 0) {
      System.err.println("Insufficient arguments: No port number provided.");
      System.exit(1);
    }
    int port = 0;
    try {
      port = Integer.parseInt(args[0]);
    } catch (NumberFormatException e) {
      System.err.println("Illegal arguments: No port number provided.");
      System.exit(1);
    }
    System.out.println("Connecting to database...");
    try {
      ConnectToDatabase("storyconfig");
      try (Statement statement = dbConnection.createStatement()) {
        statement.executeUpdate("SET search_path TO story;");
      }
    } catch (Exception e) {
      System.err.println("failed");
      System.err.println(e.getMessage());
      System.exit(1);
    }
    // use a shared object to make database accessible to all workers
    data = new WorkerData();
    data.setDBConnection(dbConnection);

    // kick off TurnManager thread to periodically update
    // whose turn it is to edit a story
    System.out.println("Starting TurnManager...");
    Thread turnManager = new Thread(new TurnManager(TurnManager.INTERVAL_HOUR, data));
    turnManager.start();

    System.out.println("Initializing ServerSocket...");
    try (ServerSocket servSock = new ServerSocket(port)) {
      Socket sock = null;
      while (true) {
        System.out.println("Waiting for incoming connection...");
        // as we accept connections, spawn Worker threads to process them
        try {
          sock = servSock.accept();
          Thread t = new Thread(new Worker(sock, data));
          t.start();
        } catch (IOException e) {
          System.err.println(e.getMessage());
        }
      }
    } catch (IOException|IllegalArgumentException e) {
      System.err.println(e.getMessage());
    }
    turnManager.interrupt();
  }
}
