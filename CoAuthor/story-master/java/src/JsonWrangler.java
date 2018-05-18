import java.awt.image.BufferedImage;
import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import javax.imageio.ImageIO;
import javax.json.*;
import javax.json.stream.JsonParsingException;

/** Utility class to simplify the handling of JSON objects, translation
 *  between JSON objects and SQL statements, and enforcing some sever-side
 *  checks on user inputs.
 *  @author Matthew Johnson */
public class JsonWrangler {
  /** Time format to be used in fields of the requests. */
  private static final String timeFormatString = "yyyy-MM-dd HH:mm:ss";
  /** Object to help format times correctly. */
  private static final SimpleDateFormat dateFormat = new SimpleDateFormat(timeFormatString);

  /** Generates a JSON representation of the given <code>ResultSet</code>.
   *    TODO: doesn't work with, eg, count(*) (only works for arrays.)
   *    @param results <code>ResultSet</code> from a SQL query to be converted.
   *    @return <code>JsonArray</code> consisting of one object per row in the
   *      <code>ResultSet</code>. In each object, one key/value pair per column. */
  public static JsonArray jsonifyResultSet(ResultSet results) {
    try {
      // use ResultSetMetaData to dynamically obtain column count as well as
      // type and name of each column
      ResultSetMetaData metadata = results.getMetaData();
      int numColumns = metadata.getColumnCount();

      JsonBuilderFactory factory = Json.createBuilderFactory(null);
      JsonArrayBuilder arrayBuilder = factory.createArrayBuilder();
      // for each record in the results, create a JsonObject
      while (results.next()) {
        JsonObjectBuilder objectBuilder = factory.createObjectBuilder();
        // add a key/value pair for each column using an appropriate type
        for (int col = 1; col <= numColumns; col++) {
          //System.out.println(metadata.getColumnLabel(col));
          switch (metadata.getColumnType(col)) {
            case Types.INTEGER:
              objectBuilder.add(metadata.getColumnLabel(col), results.getInt(col));
              break;
            case Types.DOUBLE:
              objectBuilder.add(metadata.getColumnLabel(col), results.getDouble(col));
            case Types.CHAR:
            case Types.NCHAR:
            case Types.NVARCHAR:
            case Types.VARCHAR:
              String columnLabel = metadata.getColumnLabel(col);
              String columnValue = results.getString(col);
              // if the column name ends with "_path", assume it gives a
              // location of an image file, which should be sent instead of
              // the location itself
              if (columnLabel.endsWith("_path")) {
                columnLabel = columnLabel.substring(0, columnLabel.length() - 5);
                // fixed-width column has trailing spaces, so use trim()
                if (columnValue != null && !columnValue.trim().isEmpty()) {
                  columnValue = ReadImageFromFileName(columnValue.trim());
                }
                if (columnValue == null) {
                  // TODO: what is a good flag value for "no image found"?
                  columnValue = "";
                }
              }
              objectBuilder.add(columnLabel, columnValue);
              break;
            case Types.DATE:
              objectBuilder.add(metadata.getColumnLabel(col), results.getDate(col).toString());
              break;
            case Types.TIMESTAMP:
              objectBuilder.add(metadata.getColumnLabel(col), results.getTimestamp(col).toString());
              break;
            default:
              // not all SQL types have a corresponding Types value;
              // one example is the Postgresql time interval type
              System.out.println("In column " + metadata.getColumnLabel(col) + ", unrecognized type: " + String.valueOf(metadata.getColumnType(col)));
              break;
          }
        }
        arrayBuilder.add(objectBuilder);
      }
      return arrayBuilder.build();
    } catch (SQLException|JsonException e) {
      System.err.println(e.getMessage());
    }
    return null;
  }

  /** Convert the given <code>JsonStructure</code> to a <code>String</code>.
   *  @param json <code>JsonStructure</code> which should be processed.
   *  @return <code>String</code> representation of the given JSON. */
  public static String jsonToString(JsonStructure json) {
    StringWriter writer = new StringWriter();
    try (JsonWriter jsonWriter = Json.createWriter(writer)) {
      jsonWriter.write(json);
    } catch (IllegalStateException|JsonException e) {
      System.err.println(e.getMessage());
    }
    return writer.toString();
  }

  /** Convert the given <code>String</code> to a <code>JsonStructure</code>.
   *  @param string <code>String</code> which should be processed.
   *  @return <code>JsonStructure</code> representation of the argument.
   *  @throws JsonException if i/o error causes failure while reading.
   *  @throws JsonParsingException if string is not valid JSON. */
  public static JsonStructure stringToJson(String string)
    throws JsonException, JsonParsingException {
    JsonStructure result = null;
    try (JsonReader jsonReader = Json.createReader(new StringReader(string))) {
      result = jsonReader.read();
    } catch(IllegalStateException e) {
      System.err.println(e.getMessage());
    }
    return result;
  }

  // TODO: is there a more appropriate class for this method?
  /** Check that the length of the chapter is within the limits for the story.
   *  @param con Database connection used to retrieve story limitations.
   *  @param story ID of the story the chapter is supposed to add to.
   *  @param chapter Content of the chapter.
   *  @return true if the number of words in story is less than the chapter's
   *    limit, false otherwise. */
  public static boolean ValidateChapterLength(Connection con, int story, String chapter) {
    int limit = -1;
    // count words by splitting chapter submission on any amount of whitespace
    int words = chapter.split("\\s+").length;
    try (Statement statement = con.createStatement()) {
      ResultSet result = statement.executeQuery("SELECT max_length FROM stories WHERE s_id = " + story + ";");
      result.next();
      limit = result.getInt("max_length");
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
    //System.out.println("words: " + words + "\tlimit: " + limit);
    return words <= limit;
  }

  /** Check that the given user has permission to edit the given story
   *  @param con Database connection used to check permissions.
   *  @param user ID of the user for whom to check permissions.
   *  @param story ID of the story whose permissions should be checked.
   *  @return true if the user can edit the story, false otherwise. */
  public static boolean HasEditPermissions(Connection con, int user, int story) {
    // turn-based system
    int userTurn = 0;
    try (Statement statement = con.createStatement()) {
      ResultSet result = statement.executeQuery("SELECT current_turn FROM stories WHERE s_id = " + story);
      result.next();
      userTurn = result.getInt("current_turn");
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
    return (userTurn == 0) || (userTurn == user);
    /*
    // lock-based system
    int count = 0;
    try (Statement statement = con.createStatement()) {
      ResultSet result = statement.executeQuery("SELECT COUNT(*) as count FROM locks WHERE u_id = " + user + " AND s_id = " + story + ";");
      result.next();
      count = result.getInt("count");
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
    return count > 0;
    */
  }

  /** Convert the given json object to a SQL statement according to the "type"
   *  specified in the obect. See the Create* methods for more details on each
   *  type of request.
   *  @param con Database connection for which to create the SQL statement.
   *  @param json JSON object containing data from which the queries should be
   *    modeled.
   *  @return <code>PreparedStatement</code> representing the SQL command to
   *    execute. null if an error occured or recived malformed request.
   *  @throws SQLException If something goes wrong. */
  public static PreparedStatement prepareSqlFromJson(Connection con, JsonObject json)
    throws SQLException {
    PreparedStatement statement = null;
    try {
      switch (json.getString("type")) {
        case "CreateUser":
          statement = CreateCreateUserStatement(con, json);
          break;
        case "CreateStory":
          statement = CreateCreateStoryStatement(con, json);
          break;
        case "CreateChapter":
          statement = CreateCreateChapterStatement(con, json);
          break;
        case "UpdateUser":
          statement = CreateUpdateUserStatement(con, json);
          break;
        case "QueryUsers":
          statement = CreateQueryUsersStatement(con, json);
          break;
        case "QueryStories":
          statement = CreateQueryStoriesStatement(con, json);
          break;
        case "QueryChapters":
          statement = CreateQueryChaptersStatement(con, json);
          break;
        case "CreateLock":
          statement = CreateCreateLockStatement(con, json);
          break;
        case "ReleaseLock":
          statement = CreateReleaseLockStatement(con, json);
          break;
        default:
          throw new IllegalArgumentException("Unsupported type of request!");
      }
    } catch (NullPointerException e) {
      System.err.println(e.getMessage());
    }
    return statement;
  }

  /** Generate a unique filename according to some convention.
   *  @return a unique filename */
  // TODO: how confident am I that I can count on no two calls being in
  //  the same millisecond?
  private static synchronized String GenerateImageFileName() {
    return "./img/" + String.valueOf(System.currentTimeMillis()) + ".jpg";
  }

  /** Write an image given as a String value of key "imageBytes" in the given
   *  JSON object to a file whose name is automatically generated.
   *  @param json A <code>JsonObject</code> that contains a key "imageBytes"
   *   whose value is a String representation of an image file, currently
   *   assumed to be a JPG (I'm haven't tested what happens if it isn't.)
   *  @return the name of the file to which the image was written. */
  private static String WriteImageFromJson(JsonObject json) {
    String fileName = GenerateImageFileName();
    // if image data sent as raw bytes
    //byte[] imageBytes = json.getString("imageBytes").getBytes();
    // if image data sent as array of numeric values of bytes
    String imageArrayString = json.getString("imageBytes");
    String[] byteValues = imageArrayString.split("[^-0-9]+");
    // index 0 should always be empty because of leading [, so do not include it
    byte[] imageBytes = new byte[byteValues.length - 1];
    for (int i = 1; i < byteValues.length; i++) {
      imageBytes[i - 1] = Byte.parseByte(byteValues[i]);
    }
    File file = new File(fileName);
    try (FileOutputStream out = new FileOutputStream(file)) {
      ByteArrayInputStream bais = new ByteArrayInputStream(imageBytes);
      BufferedImage img = ImageIO.read(bais);
      boolean success = ImageIO.write(img, "jpg", out);
      if (!success) {
        // TODO: maybe throw an exception instead?
        System.err.println("WriteImageFromJson: ImageIO.write returned " + success);
        //fileName = null;
      }
    } catch (IOException e) {
      System.err.println(e.getMessage());
      fileName = null;
    }
    return fileName;
  }

  /** Read the specified image file and return the result as a
   *   <code>String</code>.
   *  @param fileName name (i.e., path) of the image file to read.
   *  @return the contents of file specified by the parameter as a
   *   <code>String</code> of the values of the image's byte array. */
  private static String ReadImageFromFileName(String fileName) {
    System.out.println("Attempting to read " + fileName);
    String contents = null;
    byte[] bytes = null;
    try {
      File file = new File(fileName);
      BufferedImage img = ImageIO.read(file);
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageIO.write(img, "jpg", baos);
      bytes = baos.toByteArray();
      contents = new String(bytes);
    } catch(IOException|NullPointerException e) {
      System.err.println(e.getMessage());
    }
    // if content should be raw bytes
    //return contents;
    // if content should be String representation of array
    return bytes == null ? "" : Arrays.toString(bytes);
  }

  /** Create SQL statement to create new user using parameters from a json object.
   *  Required fields: name (String).
   *  Optional fields: imageBytes (string of decimal values of byte array), bio (String)
   *  @param con <code>Connection</code> to database to create user in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateCreateUserStatement(Connection con, JsonObject json) throws SQLException {
    PreparedStatement statement = con.prepareStatement("INSERT INTO users (name, picture_path, bio) VALUES (?, ?, ?);");
    statement.setString(1, json.getString("name"));
    String imageFilename = null;
    if (json.containsKey("imageBytes"))
      imageFilename = WriteImageFromJson(json);
    if (imageFilename == null)
      imageFilename = "";
    statement.setString(2, imageFilename);
    statement.setString(3, json.getString("bio", ""));
    return statement;
  }

  /** Create SQL statement to create new story using parameters from a json object.
   *  Required fields: creator (int), title (String), maxLength (int), genre (String).
   *  Optional fields: imageBytes (string of decimal values of byte array),
   *    description (String), content (String).
   *  @param con <code>Connection</code> to database to create story in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateCreateStoryStatement(Connection con, JsonObject json) throws SQLException {
    PreparedStatement statement = con.prepareStatement("INSERT INTO stories (creator, title, max_length, genre, picture_path, description, content) VALUES (?, ?, ?, ?, ?, ?, ?);");
    statement.setInt(1, json.getInt("creator"));
    statement.setString(2, json.getString("title"));
    statement.setInt(3, json.getInt("maxLength"));
    statement.setString(4, json.getString("genre"));
    String imageFilename = null;
    if (json.containsKey("imageBytes"))
      imageFilename = WriteImageFromJson(json);
    if (imageFilename == null)
      imageFilename = "";
    statement.setString(5, imageFilename);
    statement.setString(6, json.getString("description", ""));
    statement.setString(7, json.getString("content", ""));
    return statement;
  }

  /** Create SQL statement to create new chapter using parameters from a json object.
   *  Required fields: story (int), author (int), content (String)
   *  Optional fields: parent (int - chapter before this one; automatically appended if not specified.)
   *  @param con <code>Connection</code> to database to create chapter in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateCreateChapterStatement(Connection con, JsonObject json) throws IllegalArgumentException, SQLException {
    int story = json.getInt("story");
    int user = json.getInt("author");
    int parent = json.getInt("parent", -1);
    if (parent < 0) {
      try (Statement statement = con.createStatement()) {
        ResultSet result = statement.executeQuery("SELECT MAX(c_id) AS last_chapter FROM chapters WHERE story = " + story + ";");
        result.next();
        parent = result.getInt("last_chapter");
      } catch (SQLException e) {
        System.err.println(e.getMessage());
      }
    }
    String contribution = json.getString("content");
    if (!ValidateChapterLength(con, story, contribution)) {
      throw new IllegalArgumentException("Chapter length exceeds story limit!");
    }
    // comment/uncomment this for server-side enforcing of turn passing
    if (!HasEditPermissions(con, user, story)) {
      throw new IllegalArgumentException("It is not this user's turn to edit this story!");
    }
    // four arguments: story (int), author (int), parent (int), content (string)
    String insertChapter = "INSERT INTO chapters (story, author, parent, content) VALUES (?, ?, ?, ?);";
    // two arguments: content (string), story (int)
    String updateStory = "UPDATE stories SET content = content || ' ' || ? WHERE s_id = ?;";
    // one argument (as of last time I checked): story (int)
    String advanceTurn = TurnManager.ADVANCE_TURN;
    PreparedStatement statement = con.prepareStatement(insertChapter + updateStory + advanceTurn);
    statement.setInt(1, story);
    statement.setInt(2, user);
    // if no parent specified, set parent to SQL NULL
    if (parent <= 0) {
      statement.setNull(3, Types.INTEGER);
    } else {
      statement.setInt(3, parent);
    }
    statement.setString(4, json.getString("content"));
    statement.setString(5, json.getString("content"));
    statement.setInt(6, json.getInt("story"));
    statement.setInt(7, json.getInt("story"));
    return statement;
  }

  /** Create SQL statement to update user using parameters from a json object.
   *  Required fields: id (int)
   *  Optional fields: imageBytes (string of decimal values of byte array), bio (String)
   *  @param con <code>Connection</code> to database to update user in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateUpdateUserStatement(Connection con, JsonObject json) throws SQLException {
    // determine which fields the request specifies
    int id = json.getInt("id");
    String imageFilename = null;
    if (json.containsKey("imageBytes"))
      imageFilename = WriteImageFromJson(json);
    if (imageFilename == null)
      imageFilename = "";
    String bio = json.getString("bio", null);
    // create the query according to what arguments are available
    String update = "UPDATE users SET u_id = ?";
    if (imageFilename != null && !imageFilename.isEmpty()) update += ", picture_path = ?";
    if (bio != null) update += ", bio = ?";
    update += " WHERE u_id = ?;";
    System.out.println(update);
    PreparedStatement statement = con.prepareStatement(update);
    // fill in the blanks
    int position = 1;
    statement.setInt(position++, id);
    if (imageFilename != null) statement.setString(position++, imageFilename);
    if (bio != null) statement.setString(position++, bio);
    statement.setInt(position++, id);

    return statement;
  }

  /** Create SQL statement to query users using parameters from a json object.
   *  Optional fields: id (int), name (String), nameExact (boolean), joinedBefore
   *    (time formated as String), joinedAfter (time formated as String), bio (String),
   *  @param con <code>Connection</code> to database to query users in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateQueryUsersStatement(Connection con, JsonObject json) throws SQLException {
    // determine which fields the request specifies
    int id = json.getInt("id", -1);
    String name = json.getString("name", null);
    boolean nameExact = json.getBoolean("nameExact", false);
    String joinedBefore = json.getString("joinedBefore", null);
    String joinedAfter = json.getString("joinedAfter", null);
    String bio = json.getString("bio", null);
    // create the query according to what arguments are available
    String query = "SELECT * from users WHERE u_id >= 0";
    if (id > -1) query += " AND u_id = ?";
    if (name != null) {
      query += " AND name LIKE ?";
      if (!nameExact) name = "%" + name + "%";
    }
    if (joinedBefore != null) query += " AND (date_joined, date_joined) OVERLAPS ('-infinity'::timestamptz, ?::timestamptz)";
    if (joinedAfter != null) query += " AND (date_joined, date_joined) OVERLAPS (?::timestamptz, 'infinity'::timestamptz)";
    if (bio != null) query += " AND bio LIKE ?";
    query += ";";
    System.out.println(query);
    PreparedStatement statement = con.prepareStatement(query);
    // fill in the blanks
    int position = 1;
    if (id > -1) statement.setInt(position++, id);
    if (name != null) statement.setString(position++, name);
    if (joinedBefore != null) {
      long time = dateFormat.parse(joinedBefore, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }
    if (joinedAfter != null) {
      long time = dateFormat.parse(joinedAfter, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }
    if (bio != null) statement.setString(position++, bio);

    return statement;
  }

  /** Create SQL statement to query stories using parameters from a json object.
   *  Optional fields: id (int), creator (int), title (String), titleExact (boolean),
   *    maxLength (int), maxLengthAtLeast (int), maxLengthAtMost (int), genre (String),
   *    genreExact (String), description (String), newerThan (time formated as String),
   *    olderThan (time formated as String)
   *  @param con <code>Connection</code> to database to query stories in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateQueryStoriesStatement(Connection con, JsonObject json) throws SQLException {
    int id = json.getInt("id", -1);
    int creator = json.getInt("creator", -1);
    String title = json.getString("title", null);
    boolean titleExact = json.getBoolean("titleExact", false);
    int maxLength = json.getInt("maxLength", -1);
    int maxLengthAtLeast = json.getInt("maxLengthAtLeast", -1);
    int maxLengthAtMost = json.getInt("maxLengthAtMost", -1);
    String genre = json.getString("genre", null);
    boolean genreExact = json.getBoolean("genreExact", false);
    String description = json.getString("description", null);
    String newerThan = json.getString("newerThan", null);
    String olderThan = json.getString("olderThan", null);

    String query = "SELECT * from stories WHERE s_id >= 0";
    if (id > -1) query += " AND s_id = ?";
    if (creator > -1) query += " AND creator = ?";
    if (title != null) {
      query += " AND title LIKE ?";
      if (!titleExact) title = "%" + title + "%";
    }
    if (maxLength > -1) {
      query += " AND max_length = ?";
    } else {
      if (maxLengthAtLeast > -1) query += " AND max_length >= ?";
      if (maxLengthAtMost > -1) query += " AND max_length <= ?";
    }
    if (genre != null) {
      query += " AND genre LIKE ?";
      if (!genreExact) genre = "%" + genre + "%";
    }
    if (description != null) {
      query += " AND description LIKE ?";
    }
    if (newerThan != null) query += " AND (created, created) OVERLAPS (?::timestamptz, 'infinity'::timestamptz)";
    if (olderThan != null) query += " AND (created, created) OVERLAPS ('-infinity'::timestamptz, ?::timestamptz)";
    query += ";";
    System.out.println(query);
    PreparedStatement statement = con.prepareStatement(query);

    int position = 1;
    if (id > -1) statement.setInt(position++, id);
    if (creator > -1) statement.setInt(position++, creator);
    if (title != null) statement.setString(position++, title);
    if (maxLength > -1) {
      statement.setInt(position++, maxLength);
    } else {
      if (maxLengthAtLeast > -1) statement.setInt(position++, maxLengthAtLeast);
      if (maxLengthAtMost > -1) statement.setInt(position++, maxLengthAtMost);
    }
    if (genre != null) statement.setString(position++, genre);
    if (description != null) statement.setString(position++, description);
    if (newerThan != null) {
      long time = dateFormat.parse(newerThan, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }
    if (olderThan != null) {
      long time = dateFormat.parse(newerThan, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }

    return statement;
  }
 
  /** Create SQL statement to query chapters using parameters from a json object.
   *  Optional fields: id (int), before (int), after (int), author (int), story (int),
   *    parent (int),  newerThan (time formated as String), olderThan (time formated
   *    as String), content (String)
   *  @param con <code>Connection</code> to database to query chapters in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateQueryChaptersStatement(Connection con, JsonObject json) throws SQLException {
    int id = json.getInt("id", -1);
    int before = json.getInt("before", -1);
    int after = json.getInt("after", -1);
    int author = json.getInt("author", -1);
    int story = json.getInt("story", -1);
    int parent = json.getInt("parent", -1);
    String newerThan = json.getString("newerThan", null);
    String olderThan = json.getString("olderThan", null);
    String content = json.getString("content", null);

    String query = "SELECT * from chapters WHERE c_id >= 0";
    if (id > -1) {
      query += " AND c_id = ?";
    } else {
      if (before > -1) query += " AND c_id <= ?";
      if (after > -1) query += " AND c_id >= ?";
    }
    if (author > -1) query += " AND author = ?";
    if (story > -1) query += " AND story = ?";
    if (parent == 0) {
      query += " AND parent IS NULL";
    } else if (parent > 0) {
      query += " AND parent = ?";
    }
    if (newerThan != null) query += " AND (created, created) OVERLAPS (?::timestamptz, 'infinity'::timestamptz)";
    if (olderThan != null) query += " AND (created, created) OVERLAPS ('-infinity'::timestamptz, ?::timestamptz)";
    if (content != null) query += " AND content LIKE ?";
    query += ";";
    System.out.println(query);
    PreparedStatement statement = con.prepareStatement(query);

    int position = 1;
    if (id > -1) {
      statement.setInt(position++, id);
    } else {
      if (before > -1) statement.setInt(position++, before);
      if (after > -1) statement.setInt(position++, after);
    }
    if (author > -1) statement.setInt(position++, author);
    if (story > -1) statement.setInt(position++, story);
    if (parent == 0) {
      // check if parent is null, so no parameter needs to be set
    } else if (parent > 0) {
      statement.setInt(position++, parent);
    }
    if (newerThan != null) {
      long time = dateFormat.parse(newerThan, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }
    if (olderThan != null) {
      long time = dateFormat.parse(newerThan, new ParsePosition(0)).getTime();
      statement.setTimestamp(position++, new Timestamp(time));
    }
    if (content != null) statement.setString(position++, "%" + content + "%");

    return statement;
  }

  /** Create SQL statement to create edit lock on a story using parameters from a json object.
   *  Required fields: user (int), story (int)
   *  @param con <code>Connection</code> to database to query users in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateCreateLockStatement(Connection con, JsonObject json) throws SQLException {
    PreparedStatement statement = con.prepareStatement("INSERT INTO locks (u_id, s_id) VALUES (?, ?);");
    statement.setInt(1, json.getInt("user"));
    statement.setInt(2, json.getInt("story"));
    return statement;
  }

  /** Create SQL statement to release edit lock on a story using parameters from a json object.
   *  Required fields: user (int), story (int)
   *  @param con <code>Connection</code> to database to query users in
   *  @param json <code>JsonObject</code> giving the arguments of the SQL command.
   *  @return <code>PreparedStatement</code> of specified SQL statement. */
  private static PreparedStatement CreateReleaseLockStatement(Connection con, JsonObject json) throws SQLException {
    PreparedStatement statement = con.prepareStatement("DELETE FROM locks WHERE u_id = ? AND s_id = ?;");
    statement.setInt(1, json.getInt("user"));
    statement.setInt(2, json.getInt("story"));
    return statement;
  }
}
