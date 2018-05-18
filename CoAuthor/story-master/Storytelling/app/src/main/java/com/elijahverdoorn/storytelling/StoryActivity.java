package com.elijahverdoorn.storytelling;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;
import java.sql.Blob;
import java.util.Arrays;

public class StoryActivity extends BaseActivity {

    private static final float MAX_TEXT_SCALE_DELTA = 0.3f;

    private DatabaseHelper databaseHelper;
    private SQLiteDatabase database;

    private ImageView mImageView;
    private View mOverlayView;
    private TextView mTitleView;
    private TextView storyTextView;
    private EditText editText;
    private View mFab;
    private int mActionBarSize;
    private int mFlexibleSpaceShowFabOffset;
    private int mFlexibleSpaceImageHeight;
    private int mFabMargin;
    private boolean mFabIsShown;

    private String action;

    public static String serverAddress = "rns202-8.cs.stolaf.edu";
    public static int serverPort = 28431;
    public Socket socket;
    public OutputStream outputStream;
    public InputStream inputStream;
    public Boolean connSuccess;

    Cursor cursor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_story);
        mActionBarSize = getActionBarSize();

        databaseHelper = new DatabaseHelper(this);
        database = databaseHelper.getWritableDatabase();

        //use the intent extra
        Uri uri = getIntent().getParcelableExtra(StoryProvider.CONTENT_ITEM_TYPE);
        String storyFilter = DatabaseHelper.STORY_ID + "=" + uri.getLastPathSegment();
        cursor = getContentResolver().query(uri, DatabaseHelper.ALL_COLUMNS_STORIES, storyFilter, null, null);
        mTitleView = (TextView) findViewById(R.id.title);
        if (cursor.moveToNext()) {
            mTitleView.setText(cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_TITLE)));
        }
        storyTextView = (TextView) findViewById(R.id.textViewStoryText);
        storyTextView.setText(cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_TEXT)));

        editText = (EditText) findViewById(R.id.editTextAddition);
        mImageView = (ImageView) findViewById(R.id.imageStory);

        String fname = new File(getFilesDir(), cursor.getString(cursor.getColumnIndex(DatabaseHelper.IMAGE_BLOB_STORIES))).getAbsolutePath();
//        String fileLocation = getApplicationContext().getFilesDir().toString() + "/" + cursor.getString(cursor.getColumnIndex(DatabaseHelper.IMAGE_BLOB_STORIES));
//        Log.d("StoryAcvtivity", fname);
//        Bitmap bm = ReadImageFromFileName(fname);
//
//        if (bm != null) {
//            mImageView.setImageBitmap(bm);
//        } else {
//            Log.d("StoryActivity", "BM is null line 82");
//        }

        Drawable d = Drawable.createFromPath(fname);
        mImageView.setImageDrawable(d);


        setTitle(null);
        mFab = findViewById(R.id.fab);
        mFab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(StoryActivity.this, "Saving the Story", Toast.LENGTH_SHORT).show();

                storyTextView.setText(storyTextView.getText().toString() + " " + editText.getText().toString());
                sendStoryConnection.start(); //send the story to the server

                setResult(RESULT_OK);
                finish();
            }
        });
        mFabMargin = getResources().getDimensionPixelSize(R.dimen.margin_standard);

        int id = 1;
        // if it is not the user's turn, don't show the editing options
        if (id != cursor.getInt(cursor.getColumnIndex(DatabaseHelper.CURRENT_TURN))) {
            editText.setVisibility(View.GONE);
            mFab.setVisibility(View.GONE);
        }
    }

    Thread sendStoryConnection = new Thread(new Runnable() {
        @Override
        public void run() {
            try{
                socket = new Socket(serverAddress, serverPort);
                outputStream = socket.getOutputStream();
                inputStream = socket.getInputStream();
                connSuccess = Boolean.TRUE;
                Log.d("MainActivity", "Connection successful");
                updateChapters(1, cursor.getInt(cursor.getColumnIndex(DatabaseHelper.STORY_ID)), editText.getText().toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    });

    public void updateChapters(int creator, int id, String content) throws IOException {
        String messageType = "JSON/SQL";
        String messageContent = "{\"type\": \"CreateChapter\", \"author\": " + creator + " , \"content\": \"" + content + "\", \"story\":" + id + "}";
        MessageMaker outgoingQuery = new MessageMaker(messageType, messageContent);
        outgoingQuery.send(outputStream);
        MessageMaker response = new MessageMaker(inputStream);
        if (inputStream!=null) {                                                    //Log if query was successful
            Log.d("StoryActivity", "Added a chapter");
            Log.d("StoryActivity", response.toString());
        }
        else
            Log.d("StoryActivity", "New chapter not added");
    }

    /** Read the specified image file and return the result as a
     *   <code>String</code>.
     *  @param fileName name (i.e., path) of the image file to read.
     *  @return the contents of file specified by the parameter as a
     *   <code>String</code>. */
    private Bitmap ReadImageFromFileName(String fileName) {
        Bitmap bm;
        try {
            bm = BitmapFactory.decodeFile(fileName);
            if (bm == null) {
                Log.d("StoryActivity", "BM null line 147");
            }
            mImageView.setImageBitmap(bm);
            return bm;
        } catch(Exception e) {
            e.printStackTrace();
            Log.d("StoryActivity", "ReadImageFromFile catch reached");
            return null;
        }
    }
}