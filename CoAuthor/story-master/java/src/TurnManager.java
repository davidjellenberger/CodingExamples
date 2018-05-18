import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/** Utility class to update whose turn it is to edit a story. Provides both a
 *  <code>Runnable</code> background thread for monitoring and static methods
 *  for stand-alone calling.
 *  @author Matthew Johnson */
public class TurnManager implements Runnable {
  /** Number of milliseconds in 1 hour */
  public static final int INTERVAL_HOUR = 60 * 60 * 1000;
  
  /** String SQL command for updating the turn field of a single story. Meant
   *  for use in a <code>PreparedStatement</code> and requires one argument,
   *  an integer that is the story's id.
   *  Gives turn to a random user using a strategy from StackOverflow. */
  public static final String ADVANCE_TURN =
    "UPDATE stories SET " +
    "turn_next_seed = random(), " +
    "current_turn = (SELECT u_id FROM users LIMIT 1 " +
      "OFFSET floor(turn_next_seed * (SELECT COUNT(*) FROM users))), " +
    "turn_start = current_timestamp " +
    "WHERE s_id = ?;";

  /** <code>WorkerData</code> for sharing data with other <code>Runnable</code>
   *  objects. */
  WorkerData sharedData;
  /** Number of milliseconds to wait between automatic checks for expired
   * turns. */
  int interval;

  /** Creates a <code>TurnManager</code> that will advance expired turns on the
   *   given database connection (in the <code>WorkerData</code> object at the
   *   specified interval.
   *  @param sleepInterval int number of milliseconds between automatic checks for
   *   expired turns.
   *  @param data Object containing data common to many workers. */
  public TurnManager(int sleepInterval, WorkerData data) {
    sharedData = data;
    interval = sleepInterval;
  }

  /** Pass the turn for the given story.
   *  @param connection Database to update.
   *  @param story id of the story for which the turn should be passed. */
  public static int advanceTurn(Connection connection, int story) {
    int updated = 0;
    try (PreparedStatement statement = connection.prepareStatement(ADVANCE_TURN)) {
      statement.setInt(1, story);
      updated = statement.executeUpdate();
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
    return updated;
  }

  /** Pass the turn to edit to a new user in any story in the given database
   *  for which the user's time to edit has expired.
   *  @param connection Database to update. */
  public static int advanceExpiredTurns(Connection connection) {
    int updated = 0;
    try (Statement statement = connection.createStatement()) {
      updated = statement.executeUpdate(
          "UPDATE stories SET " +
            "turn_next_seed = random(), " +
            "current_turn = (SELECT u_id FROM users OFFSET floor(turn_next_seed * (SELECT COUNT(*) FROM users)) LIMIT 1), " +
            "turn_start = current_timestamp " +
            // update any story where the end of the turn is in the past
            "WHERE (turn_start + turn_length, turn_start + turn_length) OVERLAPS ('-infinity'::timestamptz, 'now'::timestamptz);"
      );
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
    return updated;
  }

  /** Runs the <code>advanceExpiredTurns</code> method immediately and every
   *  <code>interval</code> milliseconds thereafter. */
  @Override
  public void run() {
    Connection connection = sharedData.getDBConnection();
    int updated;
    while (true) {
      updated = advanceExpiredTurns(connection);
      System.out.println("TurnManager advanced " + updated + " turns");
      try {
        Thread.sleep(interval);
      } catch (InterruptedException e) {
        System.out.println("TurnManager exiting");
        break;
      }
    }
  }
}
