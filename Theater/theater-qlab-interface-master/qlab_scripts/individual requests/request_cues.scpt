FasdUAS 1.101.10   ��   ��    k             l     ��  ��    I C Script to retrieve Cue information and dump it into a new QLab cue     � 	 	 �   S c r i p t   t o   r e t r i e v e   C u e   i n f o r m a t i o n   a n d   d u m p   i t   i n t o   a   n e w   Q L a b   c u e   
  
 l     ��  ��    $  David Ellenberger || Oct 2017     �   <   D a v i d   E l l e n b e r g e r   | |   O c t   2 0 1 7      l     ��������  ��  ��        l     ��  ��    C = Sets variable to localhost address / port currently in use.      �   z   S e t s   v a r i a b l e   t o   l o c a l h o s t   a d d r e s s   /   p o r t   c u r r e n t l y   i n   u s e .        l     ��  ��    H B Shouldn't be hard coded, and will eventually be moved to a config     �   �   S h o u l d n ' t   b e   h a r d   c o d e d ,   a n d   w i l l   e v e n t u a l l y   b e   m o v e d   t o   a   c o n f i g      l     ����  r         m          � ! ! * h t t p : / / l o c a l h o s t : 4 0 0 0  o      ���� 0 localhostaddr localhostAddr��  ��     " # " l     ��������  ��  ��   #  $ % $ l    &���� & r     ' ( ' b    	 ) * ) b     + , + m     - - � . . 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   , o    ���� 0 localhostaddr localhostAddr * m     / / � 0 0 
 / c u e / ( o      ���� 0 get_cue_info  ��  ��   %  1 2 1 l    3���� 3 r     4 5 4 l    6���� 6 I   �� 7��
�� .sysoexecTEXT���     TEXT 7 o    ���� 0 get_cue_info  ��  ��  ��   5 o      ���� 0 cue_data  ��  ��   2  8 9 8 l     ��������  ��  ��   9  : ; : l     ��������  ��  ��   ;  < = < l   S >���� > O   S ? @ ? O    R A B A k   # Q C C  D E D l  # #�� F G��   F C = Create new Memo Cue at the end of the list to store Cue data    G � H H z   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   l i s t   t o   s t o r e   C u e   d a t a E  I J I I  # *���� K
�� .QLabmakenull���     qDoc��   K �� L��
�� 
newT L m   % & M M � N N  M e m o��   J  O P O r   + 0 Q R Q 1   + .��
�� 
qSEL R o      ���� 0 cuelist cueList P  S T S r   1 ; U V U n   1 7 W X W 4  2 7�� Y
�� 
cobj Y m   5 6������ X o   1 2���� 0 cuelist cueList V o      ���� 0 newcue newCue T  Z [ Z r   < E \ ] \ o   < =���� 0 cue_data   ] n       ^ _ ^ 1   @ D��
�� 
qNot _ o   = @���� 0 newcue newCue [  `�� ` r   F Q a b a m   F I c c � d d  C u e   D u m p b n       e f e 1   L P��
�� 
qNam f o   I L���� 0 newcue newCue��   B 4    �� g
�� 
qDoc g m    ����  @ 5    �� h��
�� 
capp h m     i i � j j & c o m . f i g u r e 5 3 . q l a b . 4
�� kfrmID  ��  ��   =  k l k l     ��������  ��  ��   l  m�� m l     ��������  ��  ��  ��       
�� n o   p q r s������   n ����������������
�� .aevtoappnull  �   � ****�� 0 localhostaddr localhostAddr�� 0 get_cue_info  �� 0 cue_data  �� 0 cuelist cueList�� 0 newcue newCue��  ��   o �� t���� u v��
�� .aevtoappnull  �   � **** t k     S w w   x x  $ y y  1 z z  <����  ��  ��   u   v   �� - /�������� i������ M������������ c���� 0 localhostaddr localhostAddr�� 0 get_cue_info  
�� .sysoexecTEXT���     TEXT�� 0 cue_data  
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
qNam�� T�E�O��%�%E�O�j E�O)���0 8*�k/ 0*��l O*�,E�O�a i/E` O�_ a ,FOa _ a ,FUU p � { { l / u s r / b i n / c u r l   - - r e q u e s t   G E T   h t t p : / / l o c a l h o s t : 4 0 0 0 / c u e / q � | |	� [ { " i d " : 1 , " n a m e " : " L e a n   I n " , " s e q u e n c e N u m " : 1 , " d e s c r i p t i o n " : " L e a n   i n t o   A n a k i n " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 0 : 3 0 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 0 : 3 0 . 0 0 0 Z " , " s h o w I d " : 2 6 } , { " i d " : 2 , " n a m e " : " A s k   i f   h e   h a s   h e a r d " , " s e q u e n c e N u m " : 2 , " d e s c r i p t i o n " : " A s k   A n n i e   i f   h e   h a s   h e a r d   t h e   t r a g e d y " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 0 4 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 0 4 . 0 0 0 Z " , " s h o w I d " : 2 6 } , { " i d " : 3 , " n a m e " : " T e l l   h i m   t h e   t r a g e d y " , " s e q u e n c e N u m " : 3 , " d e s c r i p t i o n " : " T e l l   t h e   s t o r y " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 2 3 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 2 3 . 0 0 0 Z " , " s h o w I d " : 2 6 } , { " i d " : 4 , " n a m e " : " H a v e   a n   i s s u e " , " s e q u e n c e N u m " : 1 , " d e s c r i p t i o n " : " H a v e   a n   i s s u e " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 5 7 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 1 : 5 7 . 0 0 0 Z " , " s h o w I d " : 2 7 } , { " i d " : 5 , " n a m e " : " F i x   t h e   i s s u e " , " s e q u e n c e N u m " : 2 , " d e s c r i p t i o n " : " F i x   i t " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 2 : 0 7 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 2 : 0 7 . 0 0 0 Z " , " s h o w I d " : 2 7 } , { " i d " : 6 , " n a m e " : " S o m e t h i n g   h a p p e n e d   I " , " s e q u e n c e N u m " : 1 , " d e s c r i p t i o n " : " S o m e t h i n g " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 3 : 0 9 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 3 : 0 9 . 0 0 0 Z " , " s h o w I d " : 2 8 } , { " i d " : 7 , " n a m e " : " S o m e t h i n g   h a p p e n e d   A g a i n " , " s e q u e n c e N u m " : 2 , " d e s c r i p t i o n " : " S o m e t h i n g   I I " , " c r e a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 3 : 2 0 . 0 0 0 Z " , " u p d a t e d A t " : " 2 0 1 7 - 1 0 - 1 2 T 2 3 : 0 3 : 2 0 . 0 0 0 Z " , " s h o w I d " : 2 8 } ] r �� }��  }   s s  ~ ~  �� ���   ��� � �d                                                                                      @ alis      B48DAD39-164C-46A7-B747-0#2    BD ����QLab.app                                                       ����            ����  
 cu             d   {/:private:var:folders:fs:6b3qtrws5gg2c2c6h_gvlz200000gn:T:AppTranslocation:B48DAD39-164C-46A7-B747-014D7FBF0482:d:QLab.app/     Q L a b . a p p  J $ B 4 8 D A D 3 9 - 1 6 4 C - 4 6 A 7 - B 7 4 7 - 0 1 4 D 7 F B F 0 4 8 2  /d/QLab.app   n/private/var/folders/fs/6b3qtrws5gg2c2c6h_gvlz200000gn/T/AppTranslocation/B48DAD39-164C-46A7-B747-014D7FBF0482��  
�� 
qDoc � � � � ( U n t i t l e d   W o r k s p a c e   1
�� 
aCue � � � � H 6 4 C 5 B F 6 2 - 5 4 6 A - 4 2 D 0 - A E B D - B 8 4 3 0 9 6 3 0 E E 0
�� kfrmID  ��  ��   ascr  ��ޭ