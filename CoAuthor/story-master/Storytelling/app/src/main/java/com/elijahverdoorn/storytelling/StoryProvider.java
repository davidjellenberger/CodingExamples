package com.elijahverdoorn.storytelling;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.UriMatcher;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.support.annotation.Nullable;

/**
 * Created by Elijah on 4/20/2016.
 */
public class StoryProvider extends ContentProvider{

    private static final String AUTHORITY = "com.elijahverdoorn.storytelling.storyprovider";
    private static final String BASE_PATH = "storytelling";
    public static final Uri CONTENT_URI =
            Uri.parse("content://" + AUTHORITY + "/" + BASE_PATH );

    private static final int STORIES = 1;
    private static final int STORIES_ID = 2;

    private static final UriMatcher uriMatcher = new UriMatcher(UriMatcher.NO_MATCH);

    public static final String CONTENT_ITEM_TYPE = "Story";

    static {
        uriMatcher.addURI(AUTHORITY, BASE_PATH, STORIES);
        uriMatcher.addURI(AUTHORITY, BASE_PATH + "/#", STORIES_ID);
    }

    private SQLiteDatabase database;

    @Override
    public boolean onCreate() {
        DatabaseHelper helper = new DatabaseHelper(getContext());
        database = helper.getWritableDatabase();
        return false;
    }

    @Nullable
    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        if (uriMatcher.match(uri) == STORIES_ID) {
            selection = DatabaseHelper.STORY_ID + "=" + uri.getLastPathSegment();
        }

        //this is the line that we will have to edit if we want to change the order that the stories are returned in. Right now it is in the order created, DESC
        return database.query(DatabaseHelper.TABLE_STORY, DatabaseHelper.ALL_COLUMNS_STORIES, selection, null, null, null, DatabaseHelper.STORY_CREATED + " DESC");

    }

//    public int[] getIDs(String selection) {
//        String arr[] = {DatabaseHelper.STORY_ID};
//        Cursor cursor = database.query(DatabaseHelper.TABLE_STORY, arr, selection, null, null, null, DatabaseHelper.STORY_ID);
//        int intArr[] = new int[cursor.getCount()];
//        for (int i = 0; i < cursor.getCount(); i++) {
//            intArr[i] = cursor.getInt(0);
//        }
//        return intArr;
//    }

    @Nullable
    @Override
    public String getType(Uri uri) {
        return null;
    }

    @Nullable
    @Override
    public Uri insert(Uri uri, ContentValues values) {
        long id = database.insert(DatabaseHelper.TABLE_STORY, null, values);
        return Uri.parse(BASE_PATH + "/" + id);
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return database.delete(DatabaseHelper.TABLE_STORY, selection, selectionArgs);
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return database.update(DatabaseHelper.TABLE_STORY, values, selection, selectionArgs);
    }
}
