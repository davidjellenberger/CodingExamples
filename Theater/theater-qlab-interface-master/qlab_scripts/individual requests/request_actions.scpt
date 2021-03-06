FasdUAS 1.101.10   ��   ��    k             l     ��  ��    L F Script to retrieve Action information and dump it into a new QLab cue     � 	 	 �   S c r i p t   t o   r e t r i e v e   A c t i o n   i n f o r m a t i o n   a n d   d u m p   i t   i n t o   a   n e w   Q L a b   c u e   
  
 l     ��  ��    $  David Ellenberger || Oct 2017     �   <   D a v i d   E l l e n b e r g e r   | |   O c t   2 0 1 7      l     ��������  ��  ��        l     ��  ��    C = Sets variable to localhost address / port currently in use.      �   z   S e t s   v a r i a b l e   t o   l o c a l h o s t   a d d r e s s   /   p o r t   c u r r e n t l y   i n   u s e .        l     ��  ��    H B Shouldn't be hard coded, and will eventually be moved to a config     �   �   S h o u l d n ' t   b e   h a r d   c o d e d ,   a n d   w i l l   e v e n t u a l l y   b e   m o v e d   t o   a   c o n f i g      l     ����  r         m          � ! ! * h t t p : / / l o c a l h o s t : 4 0 0 0  o      ���� 0 localhostaddr localhostAddr��  ��     " # " l     ��������  ��  ��   #  $ % $ l    &���� & r     ' ( ' b    	 ) * ) b     + , + m     - - � . . 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   , o    ���� 0 localhostaddr localhostAddr * m     / / � 0 0  / a c t i o n / ( o      ���� 0 get_action_info  ��  ��   %  1 2 1 l    3���� 3 r     4 5 4 l    6���� 6 I   �� 7��
�� .sysoexecTEXT���     TEXT 7 o    ���� 0 get_action_info  ��  ��  ��   5 o      ���� 0 action_data  ��  ��   2  8 9 8 l     ��������  ��  ��   9  :�� : l   S ;���� ; O   S < = < O    R > ? > k   # Q @ @  A B A l  # #�� C D��   C O I Create new Memo Cue at the end of the Cue list to store the Actions data    D � E E �   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   C u e   l i s t   t o   s t o r e   t h e   A c t i o n s   d a t a B  F G F I  # *���� H
�� .QLabmakenull���     qDoc��   H �� I��
�� 
newT I m   % & J J � K K  M e m o��   G  L M L r   + 0 N O N 1   + .��
�� 
qSEL O o      ���� 0 cuelist cueList M  P Q P r   1 ; R S R n   1 7 T U T 4  2 7�� V
�� 
cobj V m   5 6������ U o   1 2���� 0 cuelist cueList S o      ���� 0 newcue newCue Q  W X W r   < E Y Z Y o   < =���� 0 action_data   Z n       [ \ [ 1   @ D��
�� 
qNot \ o   = @���� 0 newcue newCue X  ]�� ] r   F Q ^ _ ^ m   F I ` ` � a a  A c t i o n s   D u m p _ n       b c b 1   L P��
�� 
qNam c o   I L���� 0 newcue newCue��   ? 4    �� d
�� 
qDoc d m    ����  = 5    �� e��
�� 
capp e m     f f � g g & c o m . f i g u r e 5 3 . q l a b . 4
�� kfrmID  ��  ��  ��       �� h i��   h ��
�� .aevtoappnull  �   � **** i �� j���� k l��
�� .aevtoappnull  �   � **** j k     S m m   n n  $ o o  1 p p  :����  ��  ��   k   l   �� - /�������� f������ J������������ `���� 0 localhostaddr localhostAddr�� 0 get_action_info  
�� .sysoexecTEXT���     TEXT�� 0 action_data  
�� 
capp
�� kfrmID  
�� 
qDoc
�� 
newT
�� .QLabmakenull���     qDoc
�� 
qSEL�� 0 cuelist cueList
�� 
cobj�� 0 newcue newCue
�� 
qNot
�� 
qNam�� T�E�O��%�%E�O�j E�O)���0 8*�k/ 0*��l O*�,E�O�a i/E` O�_ a ,FOa _ a ,FUU ascr  ��ޭ