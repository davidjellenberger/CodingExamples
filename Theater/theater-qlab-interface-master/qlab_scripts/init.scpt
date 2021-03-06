FasdUAS 1.101.10   ��   ��    k             l     ��  ��     
 init.scpt     � 	 	    i n i t . s c p t   
  
 l     ��  ��    I C Script for gathering all data that may be needed from within q lab     �   �   S c r i p t   f o r   g a t h e r i n g   a l l   d a t a   t h a t   m a y   b e   n e e d e d   f r o m   w i t h i n   q   l a b      l     ��  ��    J D Data taken from Node server and stored in notes of aptly named cues     �   �   D a t a   t a k e n   f r o m   N o d e   s e r v e r   a n d   s t o r e d   i n   n o t e s   o f   a p t l y   n a m e d   c u e s      l     ��  ��    $  David Ellenberger || Oct 2017     �   <   D a v i d   E l l e n b e r g e r   | |   O c t   2 0 1 7      l     ��������  ��  ��        l     ��������  ��  ��        l     ��   ��    - '---------------------------------------      � ! ! N - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   " # " l     �� $ %��   $ $ -*** SET BASE VARIABLES ***---    % � & & < - * * *   S E T   B A S E   V A R I A B L E S   * * * - - - #  ' ( ' l     �� ) *��   ) - '---------------------------------------    * � + + N - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - (  , - , l     ��������  ��  ��   -  . / . l     �� 0 1��   0 C = Sets variable to localhost address / port currently in use.     1 � 2 2 z   S e t s   v a r i a b l e   t o   l o c a l h o s t   a d d r e s s   /   p o r t   c u r r e n t l y   i n   u s e .   /  3 4 3 l     �� 5 6��   5 H B Shouldn't be hard coded, and will eventually be moved to a config    6 � 7 7 �   S h o u l d n ' t   b e   h a r d   c o d e d ,   a n d   w i l l   e v e n t u a l l y   b e   m o v e d   t o   a   c o n f i g 4  8 9 8 l     :���� : r      ; < ; m      = = � > > * h t t p : / / l o c a l h o s t : 4 0 0 0 < o      ���� 0 localhostaddr localhostAddr��  ��   9  ? @ ? l     ��������  ��  ��   @  A B A l     �� C D��   C P JNOTE: THIS IS CURRENTLY GRABBING CUES FOR SHOW 26 - NOT GENERALIZED YET --    D � E E � N O T E :   T H I S   I S   C U R R E N T L Y   G R A B B I N G   C U E S   F O R   S H O W   2 6   -   N O T   G E N E R A L I Z E D   Y E T   - - B  F G F l    H���� H r     I J I m    ����  J o      ���� 0 targetshowid targetShowID��  ��   G  K L K l     ��������  ��  ��   L  M N M l     �� O P��   O 
 ----    P � Q Q  - - - - N  R S R l     �� T U��   T 4 . create Curl requests to be executed later ---    U � V V \   c r e a t e   C u r l   r e q u e s t s   t o   b e   e x e c u t e d   l a t e r   - - - S  W X W l     �� Y Z��   Y 
 ----    Z � [ [  - - - - X  \ ] \ l     �� ^ _��   ^ 1 + Request Cue data and store it in a new Cue    _ � ` ` V   R e q u e s t   C u e   d a t a   a n d   s t o r e   i t   i n   a   n e w   C u e ]  a b a l    c���� c r     d e d b     f g f b     h i h m    	 j j � k k 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   i o   	 
���� 0 localhostaddr localhostAddr g m     l l � m m 
 / c u e / e o      ���� 0 get_cue_info  ��  ��   b  n o n l    p���� p r     q r q l    s���� s I   �� t��
�� .sysoexecTEXT���     TEXT t o    ���� 0 get_cue_info  ��  ��  ��   r o      ���� 0 cue_data  ��  ��   o  u v u l     ��������  ��  ��   v  w x w l     �� y z��   y 2 , Request Show data and store it in a new Cue    z � { { X   R e q u e s t   S h o w   d a t a   a n d   s t o r e   i t   i n   a   n e w   C u e x  | } | l    ~���� ~ r      �  b     � � � b     � � � m     � � � � � 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   � o    ���� 0 localhostaddr localhostAddr � m     � � � � �  / s h o w / � o      ���� 0 get_show_info  ��  ��   }  � � � l    ' ����� � r     ' � � � l    % ����� � I    %�� ���
�� .sysoexecTEXT���     TEXT � o     !���� 0 get_show_info  ��  ��  ��   � o      ���� 0 	show_data  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � 4 . Request Action Data and store it in a new Cue    � � � � \   R e q u e s t   A c t i o n   D a t a   a n d   s t o r e   i t   i n   a   n e w   C u e �  � � � l  ( / ����� � r   ( / � � � b   ( - � � � b   ( + � � � m   ( ) � � � � � 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   � o   ) *���� 0 localhostaddr localhostAddr � m   + , � � � � �  / a c t i o n / � o      ���� 0 get_action_info  ��  ��   �  � � � l  0 9 ����� � r   0 9 � � � l  0 5 ����� � I  0 5�� ���
�� .sysoexecTEXT���     TEXT � o   0 1���� 0 get_action_info  ��  ��  ��   � o      ���� 0 action_data  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � 9 3 Request Action Type data and store it in a new Cue    � � � � f   R e q u e s t   A c t i o n   T y p e   d a t a   a n d   s t o r e   i t   i n   a   n e w   C u e �  � � � l  : G ����� � r   : G � � � b   : C � � � b   : ? � � � m   : = � � � � � 8 / u s r / b i n / c u r l   - - r e q u e s t   G E T   � o   = >���� 0 localhostaddr localhostAddr � m   ? B � � � � �  / a c t i o n T y p e / � o      ���� 0 get_action_type_info  ��  ��   �  � � � l  H S ����� � r   H S � � � l  H O ����� � I  H O�� ���
�� .sysoexecTEXT���     TEXT � o   H K���� 0 get_action_type_info  ��  ��  ��   � o      ���� 0 action_type_data  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � + %-------------------------------------    � � � � J - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - �  � � � l     �� � ���   � " -*** CREATE NEW CUES ****---    � � � � 8 - * * *   C R E A T E   N E W   C U E S   * * * * - - - �  � � � l     �� � ���   � + %-------------------------------------    � � � � J - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � J D Use JSON Helper program (needs to be downloaded) to convert to JSON    � � � � �   U s e   J S O N   H e l p e r   p r o g r a m   ( n e e d s   t o   b e   d o w n l o a d e d )   t o   c o n v e r t   t o   J S O N �  � � � l     �� � ���   � N H TY Apple for being probably the only scripting lang to not support JSON    � � � � �   T Y   A p p l e   f o r   b e i n g   p r o b a b l y   t h e   o n l y   s c r i p t i n g   l a n g   t o   n o t   s u p p o r t   J S O N �  � � � l  T% ����� � O   T% � � � k   Z$ � �  � � � l  Z Z�� � ���   � - ' Convert JSON obj to Applescript record    � � � � N   C o n v e r t   J S O N   o b j   t o   A p p l e s c r i p t   r e c o r d �  � � � r   Z c � � � I  Z _�� ���
�� .DfaBrEaDnull���     **** � o   Z [���� 0 cue_data  ��   � o      ���� 0 testcuerecord testCueRecord �  � � � l  d d�� � ���   � h b loop through each cue available     <- Not idea, but will work while we don't have a billion cues    � � � � �   l o o p   t h r o u g h   e a c h   c u e   a v a i l a b l e           < -   N o t   i d e a ,   b u t   w i l l   w o r k   w h i l e   w e   d o n ' t   h a v e   a   b i l l i o n   c u e s �  ��� � X   d$ ���  � k   z  l  z z����   A ; Check each cue for it to be associated with the right show    � v   C h e c k   e a c h   c u e   f o r   i t   t o   b e   a s s o c i a t e d   w i t h   t h e   r i g h t   s h o w  l  z z�	
�  	 1 + TODO: errorcheck if show number is invalid   
 � V   T O D O :   e r r o r c h e c k   i f   s h o w   n u m b e r   i s   i n v a l i d �~ Z   z�}�| =   z � n   z  o   { �{�{ 0 showid showId o   z {�z�z 0 thecue theCue o    ��y�y 0 targetshowid targetShowID k   �  l  � ��x�x     Go to QLab    �    G o   t o   Q L a b �w O  � O   � k   �   l  � ��v!"�v  ! < 6 Create new Script Cue for each cue that fits the show   " �## l   C r e a t e   n e w   S c r i p t   C u e   f o r   e a c h   c u e   t h a t   f i t s   t h e   s h o w  $%$ I  � ��u�t&
�u .QLabmakenull���     qDoc�t  & �s'�r
�s 
newT' m   � �(( �))  S c r i p t�r  % *+* r   � �,-, 1   � ��q
�q 
qSEL- o      �p�p 0 cuelist cueList+ ./. r   � �010 n   � �232 4  � ��o4
�o 
cobj4 m   � ��n�n��3 o   � ��m�m 0 cuelist cueList1 o      �l�l 0 newcue newCue/ 565 l  � ��k78�k  7 9 3 TODO: Make this more noticable as from our program   8 �99 f   T O D O :   M a k e   t h i s   m o r e   n o t i c a b l e   a s   f r o m   o u r   p r o g r a m6 :;: r   � �<=< c   � �>?> n   � �@A@ o   � ��j�j 0 name  A o   � ��i�i 0 thecue theCue? m   � ��h
�h 
ctxt= n      BCB 1   � ��g
�g 
qNamC o   � ��f�f 0 newcue newCue; DED r   � �FGF c   � �HIH n   � �JKJ o   � ��e�e 0 description  K o   � ��d�d 0 thecue theCueI m   � ��c
�c 
ctxtG n      LML 1   � ��b
�b 
qNotM o   � ��a�a 0 newcue newCueE NON l  � ��`PQ�`  P R L Set highlighting color to green for now to easily find newly generated cues   Q �RR �   S e t   h i g h l i g h t i n g   c o l o r   t o   g r e e n   f o r   n o w   t o   e a s i l y   f i n d   n e w l y   g e n e r a t e d   c u e sO STS r   � �UVU m   � �WW �XX 
 g r e e nV n      YZY 1   � ��_
�_ 
qColZ o   � ��^�^ 0 newcue newCueT [\[ l  � ��]�\�[�]  �\  �[  \ ]^] l  � ��Z_`�Z  _ L F Fill script field of the new cue with curl request to execute the cue   ` �aa �   F i l l   s c r i p t   f i e l d   o f   t h e   n e w   c u e   w i t h   c u r l   r e q u e s t   t o   e x e c u t e   t h e   c u e^ bcb r   � �ded n   � �fgf o   � ��Y�Y 0 id  g o   � ��X�X 0 thecue theCuee o      �W�W 0 thecueid theCueIdc hih r   �jkj b   �	lml b   �non b   �pqp b   � �rsr m   � �tt �uu \ d o   s h e l l   s c r i p t   "   / u s r / b i n / c u r l   - - r e q u e s t   G E T  s o   � ��V�V 0 localhostaddr localhostAddrq m   � vv �ww  / p l a y /o o  �U�U 0 thecueid theCueIdm m  xx �yy  "k o      �T�T 0 play_cue_script  i z�Sz r  {|{ o  �R�R 0 play_cue_script  | n      }~} 1  �Q
�Q 
qScS~ o  �P�P 0 newcue newCue�S   4  � ��O
�O 
qDoc m   � ��N�N  5   � ��M��L
�M 
capp� m   � ��� ��� & c o m . f i g u r e 5 3 . q l a b . 4
�L kfrmID  �w  �}  �|  �~  �� 0 thecue theCue  o   g j�K�K 0 testcuerecord testCueRecord��   � m   T W���                                                                                  DfaB  alis    6  Macintosh HD                   BD ����JSON Helper.app                                                ����            ����  
 cu             Applications  /:Applications:JSON Helper.app/      J S O N   H e l p e r . a p p    M a c i n t o s h   H D  Applications/JSON Helper.app  / ��  ��  ��   � ��� l     �J�I�H�J  �I  �H  � ��� l     �G�F�E�G  �F  �E  � ��� l     �D�C�B�D  �C  �B  � ��� l     �A���A  � + %-------------------------------------   � ��� J - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -� ��� l     �@���@  � " -*** CREATE INFO DUMP ***---   � ��� 8 - * * *   C R E A T E   I N F O   D U M P   * * * - - -� ��� l     �?���?  � + %-------------------------------------   � ��� J - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -� ��� l     �>�=�<�>  �=  �<  � ��� l &X��;�:� O &X��� O  4W��� k  =V�� ��� l ==�9���9  � C = Create new Memo Cue at the end of the list to store Cue data   � ��� z   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   l i s t   t o   s t o r e   C u e   d a t a� ��� I =H�8�7�
�8 .QLabmakenull���     qDoc�7  � �6��5
�6 
newT� m  AD�� ���  M e m o�5  � ��� r  IR��� 1  IN�4
�4 
qSEL� o      �3�3 0 cuelist cueList� ��� r  S_��� n  S[��� 4 V[�2�
�2 
cobj� m  YZ�1�1��� o  SV�0�0 0 cuelist cueList� o      �/�/ 0 newcue newCue� ��� r  `i��� o  `a�.�. 0 cue_data  � n      ��� 1  dh�-
�- 
qNot� o  ad�,�, 0 newcue newCue� ��� r  ju��� m  jm�� ���  C u e   D u m p� n      ��� 1  pt�+
�+ 
qNam� o  mp�*�* 0 newcue newCue� ��� r  v���� m  vy�� ���  b l u e� n      ��� 1  |��)
�) 
qCol� o  y|�(�( 0 newcue newCue� ��� l ���'�&�%�'  �&  �%  � ��� l ���$�#�"�$  �#  �"  � ��� l ���!���!  � L F Create new Memo Cue at the end of the Cue list to store the Show data   � ��� �   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   C u e   l i s t   t o   s t o r e   t h e   S h o w   d a t a� ��� I ��� ��
�  .QLabmakenull���     qDoc�  � ���
� 
newT� m  ���� ���  M e m o�  � ��� r  ����� 1  ���
� 
qSEL� o      �� 0 cuelist cueList� ��� r  ����� n  ����� 4 ����
� 
cobj� m  ������� o  ���� 0 cuelist cueList� o      �� 0 newcue newCue� ��� r  ����� o  ���� 0 	show_data  � n      ��� 1  ���
� 
qNot� o  ���� 0 newcue newCue� ��� r  ����� m  ���� ���  S h o w s   D u m p� n      ��� 1  ���
� 
qNam� o  ���� 0 newcue newCue� ��� r  ����� m  ���� ���  b l u e� n      ��� 1  ���
� 
qCol� o  ���� 0 newcue newCue� � � l ������  �  �     l �����
�  �  �
    l ���	�	   O I Create new Memo Cue at the end of the Cue list to store the Actions data    � �   C r e a t e   n e w   M e m o   C u e   a t   t h e   e n d   o f   t h e   C u e   l i s t   t o   s t o r e   t h e   A c t i o n s   d a t a 	 I ����

� .QLabmakenull���     qDoc�  
 ��
� 
newT m  �� �  M e m o�  	  r  �� 1  ���
� 
qSEL o      �� 0 cuelist cueList  r  �� n  �� 4 ���
� 
cobj m  ������ o  ��� �  0 cuelist cueList o      ���� 0 newcue newCue  r  �� o  ������ 0 action_data   n       1  ����
�� 
qNot o  ������ 0 newcue newCue   r  �!"! m  ��## �$$  A c t i o n s   D u m p" n      %&% 1  � ��
�� 
qNam& o  ������ 0 newcue newCue  '(' r  )*) m  ++ �,,  b l u e* n      -.- 1  ��
�� 
qCol. o  ���� 0 newcue newCue( /0/ l ��������  ��  ��  0 121 l ��������  ��  ��  2 343 l ��56��  5 4 . Create new Memo cue to store Action Type Data   6 �77 \   C r e a t e   n e w   M e m o   c u e   t o   s t o r e   A c t i o n   T y p e   D a t a4 898 I ����:
�� .QLabmakenull���     qDoc��  : ��;��
�� 
newT; m  << �==  M e m o��  9 >?> r  #@A@ 1  ��
�� 
qSELA o      ���� 0 cuelist cueList? BCB r  $0DED n  $,FGF 4 ',��H
�� 
cobjH m  *+������G o  $'���� 0 cuelist cueListE o      ���� 0 newcue newCueC IJI r  1<KLK o  14���� 0 action_type_data  L n      MNM 1  7;��
�� 
qNotN o  47���� 0 newcue newCueJ OPO r  =HQRQ m  =@SS �TT   A c t i o n   T y p e   D u m pR n      UVU 1  CG��
�� 
qNamV o  @C���� 0 newcue newCueP WXW r  ITYZY m  IL[[ �\\  b l u eZ n      ]^] 1  OS��
�� 
qCol^ o  LO���� 0 newcue newCueX _`_ l UU��������  ��  ��  ` a��a l UU��������  ��  ��  ��  � 4 4:��b
�� 
qDocb m  89���� � 5  &1��c��
�� 
cappc m  *-dd �ee & c o m . f i g u r e 5 3 . q l a b . 4
�� kfrmID  �;  �:  � fgf l     ��������  ��  ��  g hih l     ��������  ��  ��  i jkj l     ��������  ��  ��  k lml l     ��������  ��  ��  m non l     ��������  ��  ��  o p��p l     ��������  ��  ��  ��       ��qr��  q ��
�� .aevtoappnull  �   � ****r ��s����tu��
�� .aevtoappnull  �   � ****s k    Xvv  8ww  Fxx  ayy  nzz  |{{  �||  �}}  �~~  �  ���  ��� �����  ��  ��  t ���� 0 thecue theCueu A =������ j l������ � ����� � ����� � ���������������������������(������������������W������tvx����d������#+<S[�� 0 localhostaddr localhostAddr�� �� 0 targetshowid targetShowID�� 0 get_cue_info  
�� .sysoexecTEXT���     TEXT�� 0 cue_data  �� 0 get_show_info  �� 0 	show_data  �� 0 get_action_info  �� 0 action_data  �� 0 get_action_type_info  �� 0 action_type_data  
�� .DfaBrEaDnull���     ****�� 0 testcuerecord testCueRecord
�� 
kocl
�� 
cobj
�� .corecnte****       ****�� 0 showid showId
�� 
capp
�� kfrmID  
�� 
qDoc
�� 
newT
�� .QLabmakenull���     qDoc
�� 
qSEL�� 0 cuelist cueList�� 0 newcue newCue�� 0 name  
�� 
ctxt
�� 
qNam�� 0 description  
�� 
qNot
�� 
qCol�� 0 id  �� 0 thecueid theCueId�� 0 play_cue_script  
�� 
qScS��Y�E�O�E�O��%�%E�O�j E�O��%�%E�O�j E�O��%�%E�O�j E` Oa �%a %E` O_ j E` Oa  ��j E` O �_ [a a l kh  �a ,�  �)a a a 0 �*a k/ �*a  a !l "O*a #,E` $O_ $a i/E` %O�a &,a '&_ %a (,FO�a ),a '&_ %a *,FOa +_ %a ,,FO�a -,E` .Oa /�%a 0%_ .%a 1%E` 2O_ 2_ %a 3,FUUY h[OY�UUO)a a 4a 0%*a k/*a  a 5l "O*a #,E` $O_ $a i/E` %O�_ %a *,FOa 6_ %a (,FOa 7_ %a ,,FO*a  a 8l "O*a #,E` $O_ $a i/E` %O�_ %a *,FOa 9_ %a (,FOa :_ %a ,,FO*a  a ;l "O*a #,E` $O_ $a i/E` %O_ _ %a *,FOa <_ %a (,FOa =_ %a ,,FO*a  a >l "O*a #,E` $O_ $a i/E` %O_ _ %a *,FOa ?_ %a (,FOa @_ %a ,,FOPUU ascr  ��ޭ