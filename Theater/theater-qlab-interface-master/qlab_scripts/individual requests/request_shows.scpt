FasdUAS 1.101.10   ��   ��    k             l     ��  ��    J D Script to retrieve Show information and dump it into a new QLab cue     � 	 	 �   S c r i p t   t o   r e t r i e v e   S h o w   i n f o r m a t i o n   a n d   d u m p   i t   i n t o   a   n e w   Q L a b   c u e   
  
 l     ��  ��    $  David Ellenberger || Oct 2017     �   <   D a v i d   E l l e n b e r g e r   | |   O c t   2 0 1 7      l     ��������  ��  ��        l     ��  ��    C = Sets variable to localhost address / port currently in use.      �   z   S e t s   v a r i a b l e   t o   l o c a l h o s t   a d d r e s s   /   p o r t   c u r r e n t l y   i n   u s e .        l     ��  ��    H B Shouldn't be hard coded, and will eventually be moved to a config     �   �   S h o u l d n ' t   b e   h a r d   c o d e d ,   a n d   w i l l   e v e n t u a l l y   b e   m o v e d   t o   a   c o n f i g      l     ����  r         m          � ! ! * h t t p : / / l o c a l h o s t : 4 0 0 0  o      ���� 0 localhostaddr localhostAddr��  ��     " # " l     ��������  ��  ��   #  $ % $ l    &���� & r     ' ( ' b    	 ) * ) b     + , + m     - - � . . 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   , o    ���� 0 localhostaddr localhostAddr * m     / / � 0 0  / s h o w / ( o      ���� 0 get_show_info  ��  ��   %  1 2 1 l    3���� 3 r     4 5 4 l    6���� 6 I   �� 7��
�� .sysoexecTEXT���     TEXT 7 o    ���� 0 get_show_info  ��  ��  ��   5 o      ���� 0 	show_data  ��  ��   2  8 9 8 l     ��������  ��  ��   9  : ; : l     ��������  ��  ��   ;  <�� < l   S =���� = O   S > ? > O    R @ A @ k   # Q B B  C D C l  # #�� E F��   E L F Create new Memo Cue at the end of the Cue list to store the Show data    F � G G �   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   C u e   l i s t   t o   s t o r e   t h e   S h o w   d a t a D  H I H I  # *���� J
�� .QLabmakenull���     qDoc��   J �� K��
�� 
newT K m   % & L L � M M  M e m o��   I  N O N r   + 0 P Q P 1   + .��
�� 
qSEL Q o      ���� 0 cuelist cueList O  R S R r   1 ; T U T n   1 7 V W V 4  2 7�� X
�� 
cobj X m   5 6������ W o   1 2���� 0 cuelist cueList U o      ���� 0 newcue newCue S  Y Z Y r   < E [ \ [ o   < =���� 0 	show_data   \ n       ] ^ ] 1   @ D��
�� 
qNot ^ o   = @���� 0 newcue newCue Z  _�� _ r   F Q ` a ` m   F I b b � c c  S h o w s   D u m p a n       d e d 1   L P��
�� 
qNam e o   I L���� 0 newcue newCue��   A 4    �� f
�� 
qDoc f m    ����  ? 5    �� g��
�� 
capp g m     h h � i i & c o m . f i g u r e 5 3 . q l a b . 4
�� kfrmID  ��  ��  ��       �� j k��   j ��
�� .aevtoappnull  �   � **** k �� l���� m n��
�� .aevtoappnull  �   � **** l k     S o o   p p  $ q q  1 r r  <����  ��  ��   m   n   �� - /�������� h������ L������������ b���� 0 localhostaddr localhostAddr�� 0 get_show_info  
�� .sysoexecTEXT���     TEXT�� 0 	show_data  
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
qNam�� T�E�O��%�%E�O�j E�O)���0 8*�k/ 0*��l O*�,E�O�a i/E` O�_ a ,FOa _ a ,FUUascr  ��ޭ