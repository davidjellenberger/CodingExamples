package com.elijahverdoorn.storytelling;

import android.app.LoaderManager;
import android.app.SearchManager;
import android.content.ComponentName;
import android.content.ContentValues;
import android.content.Context;
import android.content.CursorLoader;
import android.content.Intent;
import android.content.Loader;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.view.MenuItemCompat;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SearchEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.CursorAdapter;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Arrays;


public class MainActivity extends AppCompatActivity implements LoaderManager.LoaderCallbacks<Cursor> {
    private static final int EDITOR_REQUEST_CODE = 1001;
    private CursorAdapter cursorAdapter;

    DatabaseHelper databaseHelper;
    SQLiteDatabase database;

    //UI Elements
    ListView listView;
    View fab;
    SwipeRefreshLayout mainSwipeRefreshLayout;
    Handler handler;
    Runnable r;
    TextView preSwipeLabel;

    //Connection Elements
    public static String serverAddress = "rns202-8.cs.stolaf.edu";
    public static int serverPort = 28431;
    public Socket socket;
    public OutputStream outputStream;
    public InputStream inputStream;
    public Boolean connSuccess;
    Thread connection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mainSwipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.activity_main_swipe_refresh_layout);
        preSwipeLabel = (TextView) findViewById(R.id.preSwipeLabel);
        preSwipeLabel.setVisibility(View.INVISIBLE);

        cursorAdapter = new StoryCursorAdapter(this, null, 0);

        //get UI references
        listView = (ListView) findViewById(R.id.listView);

        //setup UI
        if (listView != null) {
            listView.setAdapter(cursorAdapter);
        }
        //broken as of 7:00pm sunday the 15th, also broken in search activity since I just copied it there
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(MainActivity.this, StoryActivity.class);
                Uri uri = Uri.parse(StoryProvider.CONTENT_URI + "/" + id);
                intent.putExtra(StoryProvider.CONTENT_ITEM_TYPE, uri);
                startActivityForResult(intent, EDITOR_REQUEST_CODE);
            }
        });

        //define SwipeRefreshAdapter
        mainSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshStories();
            }
        });

        //Floating Action Button
        fab = findViewById(R.id.newStoryFab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startNewStory();
            }
        });

        getLoaderManager().initLoader(0, null, this);

        //start connection to the database Asynchronously
        //also runs initial query to pull all stories
        //connection.start();

        databaseHelper = new DatabaseHelper(this);
        database = databaseHelper.getWritableDatabase();

        //insertTest();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);

        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        MenuItem searchItem = menu.findItem(R.id.search);
        android.support.v7.widget.SearchView searchView = (android.support.v7.widget.SearchView) MenuItemCompat.getActionView(searchItem);
        searchView.setSearchableInfo(searchManager.getSearchableInfo(new ComponentName(getApplicationContext(), SearchActivity.class)));

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        switch (id) {
            case R.id.action_profile:
                startProfile();
                break;
            case R.id.action_settings:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    private void startNewStory() {
        Intent intent = new Intent(this, NewStoryActivity.class);
        startActivity(intent);
    }

    private void startProfile() {
        Intent intent = new Intent(this, ProfileActivity.class);
        startActivity(intent);
    }

    //testing method to create sample data
    private void insertTest() {
        insertTestingData("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non semper ex. Donec nisl velit, bibendum eget vehicula eu, varius vel massa. Donec vitae erat ac lacus vestibulum cursus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas sit amet nisi enim. Integer rutrum, leo ac dictum ultricies, ipsum lorem hendrerit mauris, eu aliquet neque ipsum sit amet orci. Donec sodales risus ligula, sit amet cursus leo aliquet vitae. Nunc cursus ex quis porttitor mattis.", "Test Title", "Fantasy");
        insertTestingData("Morbi tristique est justo. Curabitur a laoreet diam. Etiam vulputate, nunc vel ullamcorper venenatis, sapien eros molestie nunc, in lacinia justo purus sit amet diam. Aenean luctus sem mollis blandit dapibus. Aliquam sit amet tincidunt ligula. Sed id lectus ipsum. Phasellus sit amet dui nec arcu pellentesque efficitur. Mauris ut magna placerat, sollicitudin sapien id, ornare lectus. Praesent et elit nec mauris viverra dignissim at eu nisl. Curabitur placerat a nunc eget facilisis. Fusce a gravida nunc, id sollicitudin velit. Sed a metus felis. Fusce maximus tortor eget nisl congue, ac pulvinar tortor auctor.", "Title 2", "History");
    }

    @Override
    public Loader<Cursor> onCreateLoader(int id, Bundle args) {
        return new CursorLoader(this, StoryProvider.CONTENT_URI, null, null, null, null);
    }

    @Override
    public void onLoadFinished(Loader<Cursor> loader, Cursor data) {
        cursorAdapter.swapCursor(data);
    }

    @Override
    public void onLoaderReset(Loader<Cursor> loader) {
        cursorAdapter.swapCursor(null);
    }

    @Override
    public boolean onSearchRequested(SearchEvent searchEvent) {
        return false;
    }

    //Define data reset for refresh listener
    private void refreshStories() {
        handler = new Handler();
        makeThreadConnection();
        mainSwipeRefreshLayout.setRefreshing(false);
        getLoaderManager().restartLoader(0, null, MainActivity.this);
        preSwipeLabel.setVisibility(View.INVISIBLE);
        handler.postDelayed(r, 1000);
    }

    public void makeThreadConnection() {
        //TODO: Check number of threads created
        connection = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    socket = new Socket(serverAddress, serverPort);
                    outputStream = socket.getOutputStream();
                    inputStream = socket.getInputStream();
                    connSuccess = Boolean.TRUE;
                    Log.d("MainActivity", "Connection sucessful");
                    getAllStories();
                    //getPictures();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        connection.start();
    }

    //Copied from CustomClientTask.java
    public void getAllStories() throws IOException {
        String messageType = "JSON/SQL";
        String messageContent = "{\"type\":\"QueryStories\"}";                       //should be query statement
        MessageMaker outgoingQuery = new MessageMaker(messageType, messageContent);  //Send message
        outgoingQuery.send(outputStream);
        //InputStream inputStream = socket.getInputStream();
        MessageMaker response = new MessageMaker(inputStream);                      //take in response
        //check if response was received
        if (inputStream != null) {                                                    //Log if query was successful
            Log.d("MainActivity", "getAllStories queried");
            Log.d("MainActivity", response.getContent());
            //parse response here
            try {
                JSONArray responseJSON = new JSONArray(response.getContent());
                for (int i = 0; i < responseJSON.length(); i++) {
                    JSONObject temp = responseJSON.getJSONObject(i);
                    int id = (int) temp.get("s_id");
                    String title = temp.get("title").toString();
                    String text = temp.get("content").toString();
                    String genre = temp.get("genre").toString();
                    String image = temp.get("picture").toString();
                    int current_turn = (int) temp.get("current_turn");
                    String fileName = "null";
                    if (!image.isEmpty()) {
                        String[] byteValues = image.substring(1, image.length() - 1).split(",");
                        byte[] bytes = new byte[byteValues.length];

                        for (int j = 0, len = bytes.length; j < len; j++) {
                            if (!byteValues[j].trim().isEmpty()) {
                                bytes[j] = Byte.parseByte(byteValues[j].trim());
                            }
                        }
                        fileName = WriteImageFromJson(bytes, this.getApplicationContext());
                    } else {
                        Log.d("MainActivity", "Not updating image, string response was \"\"");
                    }
                    databaseHelper.updateIfExists(database, id, title, text, genre, fileName, current_turn);
                }
            } catch (JSONException e) {
                //TODO: print this better
                Log.d("MainActivity", "JSONExecption");
                e.printStackTrace();
            }
        } else
            Log.d("MainActivity", "getAllStories NOT queried");
    }

    public void getPictures() throws IOException {
        String messageType = "JSON/SQL";
        String messageContent = "{\"type\":\"QueryImages\"}";                       //should be query statement
        MessageMaker outgoingQuery = new MessageMaker(messageType, messageContent);  //Send message
        outgoingQuery.send(outputStream);
        //InputStream inputStream = socket.getInputStream();
        MessageMaker response = new MessageMaker(inputStream);                      //take in response

        if (inputStream != null) {                                                    //Log if query was successful
            Log.d("MainActivity", "getPictures queried");
            Log.d("MainActivity", response.getContent());
            //parse response here
            try {
                JSONArray responseJSON = new JSONArray(response.getContent());
                for (int i = 0; i < responseJSON.length(); i++) {
                    JSONObject temp = responseJSON.getJSONObject(i);
                    int id = (int) temp.get("s_id");
                    byte image[] = (byte[]) temp.get("bytes"); // TODO: check this
                    String fileName = WriteImageFromJson(image, this.getApplicationContext());
                    databaseHelper.updateImages(database, id, fileName);
                }
            } catch (JSONException e) {
                //TODO: print this better
                Log.d("MainActivity", "JSONExecption");
                e.printStackTrace();
            }
        } else
            Log.d("MainActivity", "getPictures NOT queried");
    }

    public void updateStoryImage(int id, byte[] image) {
        ContentValues values = new ContentValues();
        values.put(DatabaseHelper.IMAGE_BLOB_STORIES, image);
        String filter = DatabaseHelper.STORY_ID + " = " + id;
        getContentResolver().update(StoryProvider.CONTENT_URI, values, filter, null);
    }

    public void insertTestingData(String text, String title, String genre) {
        ContentValues values = new ContentValues();
        values.put(DatabaseHelper.STORY_TEXT, text);
        values.put(DatabaseHelper.STORY_TITLE, title);
        values.put(DatabaseHelper.STORY_GENRE, genre);
        Uri storyUri = getContentResolver().insert(StoryProvider.CONTENT_URI, values);
    }

    public void insertStory(int id, String text, String title, String genre) {
        ContentValues values = new ContentValues();
        values.put(DatabaseHelper.STORY_ID, id);
        values.put(DatabaseHelper.STORY_TEXT, text);
        values.put(DatabaseHelper.STORY_TITLE, title);
        values.put(DatabaseHelper.STORY_GENRE, genre);
        Uri storyUri = getContentResolver().insert(StoryProvider.CONTENT_URI, values);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == EDITOR_REQUEST_CODE && resultCode == RESULT_OK) {
            //Update the remote database
        }
    }

    /** Generate a unique filename according to some convention.
     *  @return a unique filename */
    // TODO: how confident am I that I can count on no two calls being in
    //  the same millisecond?
    private static synchronized String GenerateImageFileName() {
        return String.valueOf(System.currentTimeMillis()) + ".jpg";
    }

    /** Write an image given as a String value of key "imageBytes" in the given
     *  JSON object to a file whose name is automatically generated.
     *  @param ba A <code>JsonObject</code> that contains a key "imageBytes"
     *   whose value is a String representation of an image file, currently
     *   assumed to be a JPG (I'm haven't tested what happens if it isn't.)
     *  @return the name of the file to which the image was written. */
    private static String WriteImageFromJson(byte[] ba, Context context) {
        String fileName = GenerateImageFileName();
        // if image data sent as raw bytes
        //byte[] imageBytes = json.getString("imageBytes").getBytes();
        // if image data sent as array of numeric values of bytes
        // index 0 should always be empty, so do not include it
        File file = new File(context.getFilesDir(), fileName);
        BufferedOutputStream bos = null;
        try {
            bos = new BufferedOutputStream(new FileOutputStream(file));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        try {
            if (bos != null) {
                bos.write(ba);
            } else {
                Log.d("MainActivity", "BOS null line 362");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            bos.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return file.getName();
    }

    /** Read the specified image file and return the result as a
     *   <code>String</code>.
     *  @param fileName name (i.e., path) of the image file to read.
     *  @return the contents of file specified by the parameter as a
     *   <code>String</code>. */
    private static Bitmap ReadImageFromFileName(String fileName) {
        System.out.println("Attempting to read " + fileName);
        Bitmap bm = null;
        try {
            bm = BitmapFactory.decodeFile(fileName);
        } catch(Exception e) {
            System.err.println(e.getMessage());
        }
        return bm;
    }


}