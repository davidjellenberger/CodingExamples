package com.elijahverdoorn.storytelling;

import android.app.Activity;
import android.app.SearchManager;
import android.content.Intent;
import android.database.Cursor;
import android.database.MergeCursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

public class SearchActivity extends Activity {

    private static final int EDITOR_REQUEST_CODE = 1001;

    String query;
    DatabaseHelper databaseHelper = new DatabaseHelper(this);

    View fab;
    ListView listView;
    TextView searchHeader;


    StoryCursorAdapter cursorAdapter;
    MergeCursor mergeCursor;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        handleIntent(getIntent());

        cursorAdapter = new StoryCursorAdapter(this, mergeCursor, 0);
        listView = (ListView) findViewById(R.id.searchListView);
        listView.setAdapter(cursorAdapter);
        //TODO: Get rid of redundancies in the list by comparing cursor values
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(SearchActivity.this, StoryActivity.class);
                Uri uri = Uri.parse(StoryProvider.CONTENT_URI + "/" + id);
                intent.putExtra(StoryProvider.CONTENT_ITEM_TYPE, uri);
                startActivityForResult(intent, EDITOR_REQUEST_CODE);
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

        searchHeader = (TextView) findViewById(R.id.searchHeader);
        searchHeader.setText("Stories containing \"" + query + "\":");
    }

    @Override
    public void onNewIntent(Intent intent) {
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (Intent.ACTION_SEARCH.equals(intent.getAction())) {
            query = intent.getStringExtra(SearchManager.QUERY);

            //TODO: ADD SEARCH HERE

            //define cursors and database
            SQLiteDatabase db = databaseHelper.getReadableDatabase();
            String SQLQuery = "SELECT * FROM " + DatabaseHelper.TABLE_STORY + " WHERE " + DatabaseHelper.STORY_TITLE + " LIKE \'%" + query +"%\' OR " + DatabaseHelper.STORY_TEXT + " LIKE \'%" + query + "%\';";
            Cursor onlyCursor = db.rawQuery(SQLQuery, null);

            Cursor [] mCursor = {onlyCursor};
            mergeCursor = new MergeCursor(mCursor);
        }
    }

    private void startNewStory() {
        Intent intent = new Intent(this, NewStoryActivity.class);
        startActivity(intent);
    }
}
