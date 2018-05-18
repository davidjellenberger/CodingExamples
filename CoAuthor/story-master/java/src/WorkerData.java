import java.sql.Connection;

/** Container class for sharing data between multiple instances of <code>
 *  Worker</code> or other <code>Runnable</code>s.
 *  @author Matthew Johnson */
public class WorkerData {
  /** <code>Connection</code> to the app's database. */
  Connection dbConnection;

  /** Create an instance of WorkerData without any content. */
  public WorkerData() {
    dbConnection = null;
  }

  /** Sets the <code>Connection</code> to the specified value.
   *  @param connection The connection to store in the shared data. */
  public synchronized void setDBConnection(Connection connection) {
    dbConnection = connection;
  }

  /** Returns the <code>Connection</code> to the app's database. */
  public synchronized Connection getDBConnection() {
    return dbConnection;
  };
}
