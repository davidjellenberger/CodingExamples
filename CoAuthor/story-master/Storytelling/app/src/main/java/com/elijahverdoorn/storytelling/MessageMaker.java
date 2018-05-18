package com.elijahverdoorn.storytelling;
/** A networking abstraction that allows sending or receiving communications
 *  over a given <code>InputStream</code> or <code>OutputStream</code>. Each
 *  <code>Message</code> consists of a field for type and a field for content.
 *  @author Matthew Johnson */

import java.io.*;
import java.net.*;
import java.util.Arrays;

public class        MessageMaker {
    // class variables

    /** Delimiter used to separate fields of the <code>Message</code> */
    static String fieldTerminator = "\001";
    /** Number of bytes in the header of the <code>Message</code>. */
    public static final int HEADER_BYTES = 128;

    // state variables

    /** The type of content that this <code>Message</code> contains. */
    String type;
    /** The content of the <code>Message</code>. */
    String content;

    /** Initializes an instance of <code>Message</code> with the specified type
     *  and content.
     *  @param messageType The type of content this <code>Message</code> contains.
     *  @param messageContent The content of this <code>Message</code>. */
    public MessageMaker(String messageType, String messageContent) {
        type = messageType;
        content = messageContent;
    }

    /** Initializes an instance of <code>Message</code> by reading bytes <code>
     *  InputStream</code> and using <code>fieldTerminator</code> as a field
     *  delimitor. It uses the length specified in the header to listen for the
     *  correct number of bytes in the <code>Message</code> content.
     *  @param inStream <code>InputStream</code> from which to read.
     *  @exception IOException Thrown if reading from <code>inStream</code> fails.
     *  @exception NumberFormatException Thrown if the length is not a number.
     *  @exception ArrayIndexOutOfBoundsException Thrown if the received mesasge
     *    does not contain both type and length. */
    public MessageMaker(InputStream inStream) throws IOException, ArrayIndexOutOfBoundsException {
        // read in the header of the message
        int byteCount = 0;
        byte[] bytes = new byte[HEADER_BYTES];
        byteCount = inStream.read(bytes);
        //System.out.println(new String(bytes));
        String[] tokens = (new String(bytes)).split(fieldTerminator);
        type = tokens[0];
        int length = Integer.parseInt(tokens[1]);

        // using the provided length, read the content of the message
        byteCount = 0;
        bytes = new byte[length];
        int readCount = 0;
        while (byteCount < length) {
            byteCount += inStream.read(bytes, byteCount, length - byteCount);
            readCount++;
            //System.out.println("Times read: " + readCount);
        }
        //System.out.println(new String(bytes));
        if (byteCount != length) {
            throw new IOException("Incomplete message received! Expected " + length +
                    ", received " + byteCount);
        }
        content = new String(bytes);
    }

    /** Get the <code>type</code> of the <code>Message</code>.
     *  @return The value of <code>type</code>. */
    public String getType() {
        return type;
    }

    /** Get the <code>content</code> of the <code>Message</code>.
     *  @return The value of <code>content</code>. */
    public String getContent() {
        return content;
    }

    /** Produce a <code>byte[]</code> version of the header of the Message, as
     *  would be written during the <code>send</code> method.
     *  @return A <code>byte[]</code> version of the <code>Message</code> header
     *    obtained by joining the <code>type</code> and <code>content</code> length,
     *    each terminiated by <code>fieldTerminator</code> */
    public byte[] getHeader() {
        char[] paddingBytes = new char[HEADER_BYTES];
        Arrays.fill(paddingBytes, '-');
        String paddingString = new String(paddingBytes);
        String headerContent = type + fieldTerminator + String.valueOf(content.length()) + fieldTerminator;
        return (headerContent + paddingString).substring(0, HEADER_BYTES).getBytes();
    }

    /** Return the content as a <code>byte</code> array.
     *  @return The value of <code>content</code> as a <code>byte</code>-array. */
    public byte[] getContentBytes() {
        return content.getBytes();
    }

    /** Write the message on the specified <code>OutputStream</code>.
     *  @param outStream <code>OutputStream</code> on which to write the
     *    <code>Message</code>.
     *  @exception IOException Thrown if writing to <code>outStream</code> fails. */
    public void send(OutputStream outStream) throws IOException {
        byte[] headerBytes = getHeader();
        byte[] contentBytes = getContentBytes();
        //System.out.println(new String(headerBytes));
        outStream.write(headerBytes);
        //System.out.println(new String(contentBytes));
        outStream.write(contentBytes);
    }

    /** Produce a human-readable representation of this <code>Message</code>.
     *  @return A human-readable representaiton of this <code>Message</code>. */
    public String toString() {
        return "[type: " + type + "; length: " + content.length() + "]\n" + content;
    }
}