package com.elijahverdoorn.storytelling;

import android.content.Context;
import android.database.Cursor;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CursorAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.Arrays;

/**
 * Created by Elijah on 4/16/2016.
 */
public class StoryCursorAdapter extends CursorAdapter {

    public StoryCursorAdapter(Context context, Cursor cursor, int flags) {
        super(context, cursor, flags);
    }

    @Override
    public View newView(Context context, Cursor cursor, ViewGroup parent) {
        return LayoutInflater.from(context).inflate(R.layout.list_item, parent, false);
    }

    @Override
    public void bindView(View view, Context context, Cursor cursor) {
        String storyTitle = cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_TITLE));
        String storyText = cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_TEXT));
        String storyGenre = cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_GENRE));
        String storyDate = cursor.getString(cursor.getColumnIndex(DatabaseHelper.STORY_CREATED));
        // here we need to add the code that will set the textViews of the list to the appropriate values. See example code below from notes:

        RelativeLayout layout = (RelativeLayout) view.findViewById(R.id.storyListItemLayout);
        TextView titleTextView = (TextView) view.findViewById(R.id.textViewTitleList);
        TextView wordCountTextView = (TextView) view.findViewById(R.id.textViewWordCountList);
        TextView previewTextView = (TextView) view.findViewById(R.id.textViewPreviewList);
        TextView genreTextView = (TextView) view.findViewById(R.id.textViewGenreList);
        TextView dateTextView = (TextView) view.findViewById(R.id.textViewDateList);

        int id = 1;
        // highlight the stories for which it is the user's turn to edit
        if (id == cursor.getInt(cursor.getColumnIndex(DatabaseHelper.CURRENT_TURN))) {
            layout.setBackgroundColor(context.getResources().getColor(R.color.colorEditable));
        } else {
            layout.setBackgroundColor(Color.TRANSPARENT);
        }

        titleTextView.setText(storyTitle);
        try {
            if (storyText == null || storyText.isEmpty()){
                wordCountTextView.setText("0 Words");
            } else {
                int wordCount = storyText.split(" ").length - 1;
                wordCountTextView.setText(wordCount + " Words");
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        genreTextView.setText(storyGenre);
        dateTextView.setText(storyDate);
        int pos;
        try {
            previewTextView.setText(storyText);
        } catch (NullPointerException e) {
            storyText = "...";
            e.printStackTrace();
        }
        previewTextView.setText(storyText);
    }
}