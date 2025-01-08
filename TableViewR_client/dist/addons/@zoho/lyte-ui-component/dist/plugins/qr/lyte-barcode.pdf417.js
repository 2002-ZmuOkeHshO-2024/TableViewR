/*
 * This plugin is used for creating Pdf 417 barcodes in web.
 * contact @lyte-team@zohocorp.com
 */


/**
 * To do
 * Micro Pdf 417
 * Feb 1, 2024
 */

;( function(){

   var default_options = {
      width : void 0, 
      height : void 0, 
      fill_color : "black", 
      non_fill_color : "white", 
      quiet_zone : 1, 
      background : "white", 
      scale : window.devicePixelRatio,
      aspect_ratio : 2,
      row_height : 4
    },
    text_sub_mode = {
         /**
          * Sub modes of Text compact mode.
          * Each sub modes uses different combination of texts
          */
         a : fill_letters( 65, 90 ).concat( [ 32 ] ), // Alpha
         l : fill_letters( 97, 122 ).concat( [ 32 ] ), // Lower
         m : fill_letters( 48, 57 ).concat( [ 38, 13, 9, 44, 58, 35, 45, 46, 36, 47, 43, 37, 42, 61, 94, void 0, 32 ] ), // Mixed
         p : [ 59, 60, 62, 64, 91, 92, 93, 95, 96, 126, 33, 13, 9, 44, 58, 10, 45, 46, 36, 47, 34, 124, 42, 40, 41, 63, 123, 125, 39 ] //Punctuation
    },
    text_mode_shift = {
         /**
          * Character indicating to shifting between different text sub modes
          */
         a_l : [ 27 ],
         a_m : [ 28 ],
         a_p : [ 28, 25 ],
         l_a : [ 28, 28 ],
         l_m : [ 28 ],
         l_p : [ 28, 25 ],
         m_a : [ 28 ],
         m_l : [ 27 ],
         m_p : [ 25 ],
         p_a : [ 29 ],
         p_l : [ 29, 27 ],
         p_m : [ 29, 28 ]
    },
    cluster = [
      /**
       * Different Cluster values for encoding Each values( upto 900 characters )
       * Each Cluster values are unique.
       * Could not create these by formulae. So hardcoded these values
       * Here values are in base 36. Convert it to respective base before using these
       */
      ["2ksg","2oz4","2r24","2km8","2ovs","2r0e","2bwg","2kj4","2bts","1uf4","2bsg","1ue8","2cw0","2l0w","2p30","2cps","2kxk","2p1a","1w3k","2cmo","1w0w","1x34","2d4g","2l4s","1www","2d14","2l32","1wts","2czg","1xbk","2d8c","1x88","2d6m","1xfg","2r5m","2k80","2ooo","2qwu","2b40","2k4w","2on0","2b1c","2k3c","1su8","2b00","2k2k","1stc","2azc","1ssw","2bj4","2kc8","2oqm","1tq8","2bg0","2kak","1tnk","2beg","2k9q","1tm8","2bdo","1u5c","2bnc","2ke6","1u28","2blo","1u0o","2bku","1u9k","2bpa","1u7w","1u72","2aps","2jxs","2ojg","2an4","2jw8","2oim","1s1s","2als","2jvg","1s0w","2al4","1s0g","1s08","1sjk","2auo","2jzw","1sgw","2at4","2jz2","1sfk","2asc","1sew","1sek","1sog","2aws","1smw","2avy","1sm4","1sqk","2ag0","2jso","2ogu","1rnk","2aeo","2jrw","1rmo","2ae0","2jri","1rm8","2ado","1rm0","2adi","1rvk","2aig","2jtq","1ru8","2aho","1rtk","2aha","1rt8","1rt2","2aji","1rwu","1rgg","2ab4","2jq4","1rfk","2aag","2jpq","1rf4","2aa4","1rew","2a9y","1res","1rjk","1riw","1rik","1rc0","2jou","2a8c","2a86","1rb6","2in4","2nw8","2qim","27y8","2ik0","2nuk","27vk","2iig","2ntq","1mio","27u8","1mhs","28dc","2irc","2ny6","1neo","28a8","2ipo","1nc0","288o","1nao","1na0","1nts","28hk","2ita","1nqo","28fw","1np4","1noc","1ny0","28ji","1nwc","1nzy","2ls0","2pgw","2rb0","2lpc","2pfc","2ra6","2e68","2lo0","2pek","2e5c","2lnc","2pe6","2e4w","2ln0","27k0","2icw","2nr0","2eo0","27hc","2ibc","2nq6","2elc","2lvc","2pi6","1zy8","1lpc","27fc","2ia6","1zxc","2ejc","1zww","1m80","27ow","2if0","20g0","1m5c","27nc","2ie6","20dc","2erc","2ly6","20c0","1m3c","20bc","1mcw","27r0","20kw","1mbc","27q6","20jc","2eu6","20ik","1mf0","20n0","1me6","20m6","2li8","2pbs","2r8e","2ds0","2lgw","2pb0","2dr4","2lg8","2pam","2dqo","2lfw","2dqg","2dqc","27a8","2i7s","2noe","2e00","278w","2i70","1yrk","1lb4","2ljw","2i6m","1yqo","1lao","277w","1yq8","2dxo","277q","1lac","1lk0","27co","2i8u","1yzk","1lio","27bw","1yy8","2e1o","27bi","1yxk","1lho","1lhi","1lmg","27dq","1z20","1llo","1z18","1lla","1z0u","1z32","2dkw","2ldc","2p98","2dk0","2lco","2p8u","2djk","2lcc","2djc","2lc6","2dj8","2dj6","1l4w","275c","2i58","1y68","1l40","274o","2i4u","1y5c","2dnc","2le6","1y4w","1l3c","2746","1y4o","2dmu","1y4k","1l80","276k","1y9c","1l7c","2766","1y8o","2dou","1y8c","1l6u","1y86","1yak","1ya6","2dgg","2law","2p7y","2dg0","2lak","2dfs","2lae","2dfo","2dfm","1l0g","272w","2i3y","1xuo","1l00","272k","1xu8","2dho","272e","1xu0","1kzo","1xtw","1kzm","1l20","1xw8","1xvw","1xvq","2l9o","2l9i","2ddu","271o","1ky0","1xoo","1xok","1xoi","25z4","2hkg","2ncs","25wg","2hiw","1ikg","25v4","2hi4","1ijk","25ug","1ij4","1iiw","1j28","2640","2hmk","1izk","262g","2hlq","1iy8","261o","1ixk","1ix8","1j74","2664","1j5k","265a","1j4s","1j98","1j8e","2j4w","2o54","2qn2","291c","2j3k","2o4c","290g","2j2w","2o3y","2900","2j2k","28zs","2j2e","25pc","2hfc","2na6","299c","25o0","2hek","1pa8","1i5c","2j6k","2he6","1p9c","297c","25n0","1p8w","1i4o","1p8o","1ie8","25rs","2hge","1pi8","1icw","2j8e","1pgw","29b0","25qm","1pg8","1ibw","1pfw","1igo","25su","1pko","1ifw","1pjw","1ifi","1ihq","1plq","2m9s","2pps","2rfg","2m8w","2pp4","2rf2","2m8g","2pos","2m88","2pom","2m84","28u8","2j00","2o2k","2fk0","28tc","2pr0","2o26","2fj4","2mc8","2pqm","2fio","28so","2iyu","2fig","2mbq","28si","1hz4","25kg","2hcs","1oow","1hy8","25js","2hce","224g","1oo0","28wo","2j0u","223k","2fmg","2mdq","25ja","2234","1onc","28w6","222w","1hxe","1i28","25lo","1os0","1i1k","25la","227k","1orc","28y6","226w","2fny","1i12","1oqu","1i3g","1ot8","1i32","228s","1osu","2m5c","2pnc","2re6","2m4w","2pn0","2m4o","2pmu","2m4k","2m4i","28ps","2ixk","2o1a","2f8g","28pc","2pny","2f80","2m6k","2ix2","2f7s","28p0","2f7o","28oy","2f7m","1huo","25i0","2hbi","1odc","1hu8","25ho","21eo","1ocw","28r0","25hi","21e8","2f9o","1htw","21e0","1ock","1htu","1oci","1hw8","25im","1oew","1hvw","21g8","1oek","1hvq","21fw","1oee","1hwu","21gu","2m34","2pm4","2m2w","2ply","2m2s","2m2q","28nk","2iwc","2f2o","28nc","2iw6","2f2g","2m3q","2f2c","28n6","2f2a","1hsg","25gs","1o7k","1hs8","25gm","211s","1o7c","28o6","211k","2f3a","1hs2","211g","1o76","211e","1o8c","212k","212e","2pli","2m1u","2ivq","28mc","28ma","1hrc","1o4o","20vc","1hr6","1o4i","24ww","1glc","24vk","1gkg","24uw","2gzy","1gk0","24uk","1gjs","24ue","1gtc","24zc","2h26","1gs0","24yk","1grc","24y6","1gr0","1gqu","1gvs","250e","1gv0","1gum","1gwu","26gw","2htc","2nh8","26g0","2hso","26fk","2hsc","26fc","2hs6","26f8","1ge8","24s0","2gyk","1jy8","1gdc","2huk","2gy6","1jxc","26jc","2hu6","1jww","1gco","24qu","1jwo","26iu","1gci","1ghc","24t8","1k1c","1ggo","24su","1k0o","26ku","1k0c","1gg6","1gik","1k2k","1gi6","1k26","2jds","2o9k","2qpa","2jdc","2o98","2jd4","2o92","2jd0","2jcy","26cg","2hqw","29pc","26c0","2hqk","29ow","2jf0","2hqe","29oo","26bo","29ok","26bm","29oi","1g9s","24pk","1jmo","1g9c","2hri","1qcg","1jm8","26do","24p2","1qc0","29qk","1g90","1qbs","1jlw","1g8y","1jlu","1gbc","24q6","1jo8","1gb0","1qe0","1jnw","1gau","1qdo","1jnq","1gby","1jou","1qem","2pu8","2rho","2pu0","2rhi","2ptw","2ptu","2jbk","2o8c","2mkw","2pv0","2o86","2mko","2puu","2mkk","2jb6","2mki","26a8","2hpo","29jk","26a0","2hpi","2g28","29jc","2jc6","2g20","2mli","269u","2g1w","29j6","2g1u","1g7k","24oc","1jgw","1g7c","24o6","1pzk","1jgo","26au","230w","1pzc","29k6","1g76","230o","2g2u","1jgi","230k","1g8c","1jho","1g86","1q0c","1jhi","231o","1q06","231i","2pt4","2rh2","2pt0","2psy","2jag","2o7q","2mi0","2pti","2mhw","2jaa","2mhu","2694","2hp2","29go","2690","2fvs","29gk","268y","2fvo","29gi","2fvm","1g6g","24nq","1je0","269i","1pt4","1jdw","1g6a","22nc","1pt0","1jdu","22n8","1psy","22n6","1jee","22nq","2psi","2mgk","2mgi","29f8","2fsk","2fsi","1jck","1ppw","22gk","22gi","1fls","1fkw","24d4","1fkg","1fk8","1fk4","1fow","1fo8","1fnw","1fnq","1fq4","1fpq","255s","255c","2h58","2554","2h52","2550","254y","1fhc","24bc","1h9c","257c","24b0","1h8w","2570","1h8o","256u","1h8k","1fgi","1h8i","1fiw","24by","1haw","257y","1hak","1fie","1hae","1fji","1hbi","2hxs","2hxk","2hxg","2hxe","253k","26s0","2hyk","2h46","26rs","2hye","26ro","2536","26rm","1ff4","1h3k","1few","249y","1kgg","1h3c","1fes","1kg8","1h38","1feq","1kg4","1h36","1ffw","1h4c","1ffq","1kh8","1h46","1kh2","2obs","2obo","2obm","2hwo","2jjc","2oc6","2jj8","2hwi","2jj6","252g","2h3q","26p4","2hx2","29yg","26p0","252a","29yc","26oy","29ya","1fe0","249i","1h0o","252u","1ka0","1h0k","1fdu","1qso","1k9w","1h0i","1qsk","1k9u","1fee","1h12","1kae","1qt2","2ris","2riq","2ob8","2px0","2ob6","2pwy","2hw4","2jhw","2hw2","2mpg","2jhu","2mpe","251w","26no","251u","29v8","26nm","2gac"],
      ["2r1c","2s3c","2ou8","2r00","2s2k","2otc","2qzc","2s26","2osw","2qz0","2oso","2qyu","2osk","2p28","2r3s","2s4e","2kw0","2p0w","2r30","2kv4","2p08","2r2m","2kuo","2ozw","2kug","2ozq","2kuc","2l40","2p4o","2r4u","2czk","2l2o","2p3w","2cyo","2l20","2p3i","2cy8","2l1o","2cy0","2l1i","2cxw","2d7k","2l6g","2p5q","1x6o","2d68","2l5o","1x5s","2d5k","2l5a","1x5c","2d58","1x54","2d52","1xeo","2da0","2l7i","1xdc","2d98","1xco","2d8u","1xcc","1xh4","2db2","1xgc","1xfy","2on4","2qwg","2s0s","2om8","2qvs","2s0e","2ols","2qvg","2olk","2qva","2olg","2ole","2kao","2oq8","2qxo","2k9s","2opk","2qxa","2k9c","2op8","2k94","2op2","2k90","2k8y","2bls","2kds","2org","2bkw","2kd4","2or2","2bkg","2kcs","2bk8","2kcm","2bk4","2bk2","1u80","2bow","2kf0","1u74","2bo8","2kem","1u6o","2bnw","1u6g","2bnq","1u6c","1ub4","2bq4","1uag","2bpq","1ua4","1u9y","1ucc","1uby","2oio","2qu0","2rzi","2oi8","2qto","2oi0","2qti","2ohw","2ohu","2jz4","2ok8","2qum","2jyo","2ojw","2jyg","2ojq","2jyc","2jya","2aw0","2k0o","2oku","2avk","2k0c","2avc","2k06","2av8","2av6","1sps","2axk","2k1a","1spc","2ax8","1sp4","2ax2","1sp0","1soy","1src","2ay6","1sr0","1squ","1sry","2ogg","2qss","2og8","2qsm","2og4","2og2","2jtc","2oh8","2jt4","2oh2","2jt0","2jsy","2aj4","2ju4","2aiw","2jty","2ais","2aiq","1ryo","2ajw","1ryg","2ajq","1ryc","1rya","1rzg","1rza","2ofc","2qs6","2of8","2of6","2jqg","2ofq","2jqc","2jqa","2aco","2jqu","2ack","2aci","1rl4","2ad2","1rl0","1rky","2oes","2oeq","2jp0","2joy","2a9g","2a9e","2nuo","2qi8","2rto","2nts","2qhk","2rta","2ntc","2qh8","2nt4","2qh2","2nt0","2nsy","2ips","2nxs","2qjg","2iow","2nx4","2qj2","2iog","2nws","2io8","2nwm","2io4","2io2","28g0","2isw","2nz0","28f4","2is8","2nym","28eo","2irw","28eg","2irq","28ec","28ea","1nwg","28j4","2iu4","1nvk","28ig","2itq","1nv4","28i4","1nuw","28hy","1nus","1nzk","28kc","1nyw","28jy","1nyk","1nye","1o0s","1o0e","2ra8","2s7s","1zw0","2r9s","2s7g","1zi0","2r9k","2s7a","1zb0","2r9g","2r9e","2nq8","2qfs","2rse","2pi8","2nps","2s8e","2phs","2rbg","2qfa","2phk","2npg","2phg","2npe","2phe","2ie8","2nrs","2qge","2ly8","2ids","2nrg","2lxs","2pjg","2nra","2lxk","2idg","2lxg","2ide","2lxe","27q8","2ifs","2nse","2eu8","27ps","2ifg","2ets","2lzg","2ifa","2etk","27pg","2etg","27pe","2ete","1me8","27rs","2ige","20m8","1mds","27rg","20ls","2evg","27ra","20lk","1mdg","20lg","1mde","1mfs","27se","20ns","1mfg","20ng","1mfa","20na","1mge","2r80","2s6k","1ypk","2r7s","2s6e","1yik","2r7o","1yf2","2r7m","2no0","2qek","2pcg","2nns","2qee","2pc8","2r8m","2pc4","2nnm","2pc2","2i8g","2nos","2llc","2i88","2nom","2ll4","2pd2","2ll0","2i82","2lky","27dc","2i98","2e34","27d4","2i92","2e2w","2lly","2e2s","27cy","2e2q","1ln4","27e4","1z2o","1lmw","27dy","1z2g","2e3q","1z2c","1lmq","1z2a","1lnw","1z3g","1lnq","1z3a","2r6w","2s5y","1y4c","2r6s","1y0u","2r6q","2nmw","2qdy","2p9k","2r7a","2p9g","2nmq","2p9e","2i5k","2nna","2lew","2i5g","2les","2i5e","2leq","276w","2i5y","2dpk","2lfa","2dpg","276q","2dpe","1l9k","277a","1yaw","1l9g","1yas","1l9e","1yaq","1l9y","1yba","2r6c","1xtq","2r6a","2nmc","2p84","2nma","2p82","2i44","2lbo","2i42","2lbm","273o","2dis","273m","2diq","1l2s","1xx0","1l2q","1xwy","2r62","2nm2","2p7e","2i3e","2la2","2722","2dfe","2nc0","2q8o","2rou","2nbk","2q8c","2nbc","2q86","2nb8","2nb6","2hls","2ndk","2q9a","2hlc","2nd8","2hl4","2nd2","2hl0","2hky","265c","2hnc","2ne6","264w","2hn0","264o","2hmu","264k","264i","1j8g","266w","2hny","1j80","266k","1j7s","266e","1j7o","1j7m","1ja0","267i","1j9o","1j9i","1jam","2qmo","2rvw","1p88","2qmg","2rvq","1p18","2qmc","1oxq","2qma","2n9s","2q7g","2o5s","2n9k","2q7a","2o5k","2qna","2o5g","2n9e","2o5e","2hg0","2nak","2j80","2hfs","2nae","2j7s","2o6e","2j7o","2hfm","2j7m","25sg","2hgs","29cg","25s8","2hgm","29c8","2j8m","29c4","25s2","29c2","1ihc","25t8","1plc","1ih4","25t2","1pl4","29d2","1pl0","1igy","1pky","1ii4","1pm4","1ihy","1ply","2sa0","21v4","2fi4","2s9w","21o8","2fem","2s9u","21ks","21j2","2qlk","2rva","1on0","2rfs","2sae","222k","1oji","2rfo","2qle","21z2","2rfm","2n8o","2q6u","2o2w","2n8k","2prc","2rg6","2n8i","2pr8","2o2q","2pr6","2hd4","2n92","2j1k","2hd0","2meg","2j1g","2hcy","2mec","2j1e","2mea","25m0","2hdi","28yw","25lw","2foo","28ys","25lu","2fok","28yq","2foi","1i3s","25me","1otk","1i3o","2294","1otg","1i3m","2290","1ote","228y","1i46","1oty","2s9g","21a0","2f7i","2s9e","216k","214u","2ql0","1oce","2rec","2qky","21dq","2rea","2n84","2o1g","2n82","2po4","2o1e","2po2","2hbo","2iyc","2hbm","2m7o","2iya","2m7m","25is","28s4","25iq","2fas","28s2","2faq","1hx0","1ofo","1hwy","21h0","1ofm","21gy","2s96","20zg","20xq","2qkq","2rdm","2n7u","2o0q","2pmi","2hay","2iwq","2m4a","25h6","28oq","2f3u","1htm","1o8q","212y","20u6","2n2o","2q3w","2n2g","2q3q","2n2c","2n2a","2h1s","2n3g","2h1k","2n3a","2h1g","2h1e","2500","2h2k","24zs","2h2e","24zo","24zm","1gwg","250s","1gw8","250m","1gw4","1gw2","1gx8","1gx2","2qaw","2rpy","1jwc","2qas","1jsu","2qaq","2n1k","2q3a","2nhk","2n1g","2nhg","2n1e","2nhe","2gyw","2n1y","2huw","2gys","2hus","2gyq","2huq","24tk","2gza","26lk","24tg","26lg","24te","26le","1giw","24ty","1k2w","1gis","1k2s","1giq","1k2q","1gja","1k3a","2rx0","1q7s","29oe","2rwy","1q4c","1q2m","2qac","1jlq","2qpg","2qaa","1qbi","2qpe","2n10","2ng4","2n0y","2oac","2ng2","2oaa","2gxg","2hro","2gxe","2jg4","2hrm","2jg2","24qc","26es","24qa","29ro","26eq","29rm","1gc4","1jp0","1gc2","1qes","1joy","1qeq","22uo","2fzw","22rc","2fy6","22po","22ou","2rwq","1px8","2sbe","22yk","1pvi","22wu","2qa2","2qoq","2ri2","2n0q","2nfe","2o8q","2pve","2gwq","2hq2","2jcq","2mm2","24oq","26be","29kq","2g3e","1g8q","1ji2","1q0q","22k8","2fum","22ik","22hq","1pry","22m6","22f0","22e6","22ce","2my0","2mxw","2mxu","2grs","2mye","2gro","2grm","24fc","2gs6","24f8","24f6","1fqg","24fq","1fqc","1fqa","1fqu","2q50","1h8e","2q4y","2mxg","2n5g","2mxe","2n5e","2gqc","2h6c","2gqa","2h6a","24c4","2584","24c2","2582","1fjo","1hbo","1fjm","1hbm","2rqi","1ke4","1kce","2q4q","2qca","2mx6","2n4q","2nju","2gpm","2h4q","2hyy","24ai","254q","26t6","1fga","1h4q","1khm","1qpk","29xa","1qnw","1qn2","1k8u","1qri","23cg","2g8s","23aw","2g7y","23a4","239q","1qkc","23ek","1qji","23dq","237c","2g66","236k","2366","1qhq","238e","234s","234e","233i","2gms","2gmq","2450","244y","1f5g","1f5e","2mze","2gm2","2gu2","243e","24je","1f22","1fy2","1hha","1kn0","1km6","1qyg","2a1q","1qxo","1qxa","1kke","1qzi","23lc","2gd8","23ko","2gcu","23kc","23k6","1qvw","23mk","1qvi","23m6","23iw","2gby","23ik","23ie","1qum","23ji","23ho","23hi","1hlq","1krg","1kr2","1r2w","2a3y","1r2k","1r2e","1kq6","1r3i","1r1o","1r1i"],
      ["2cio","2ku0","1v40","2c4w","2kn0","1uqo","2by0","2kji","1uk0","2buk","1ugo","2s40","1wps","2cxk","2s3s","1wc0","2cqk","2s3o","1w54","2cn2","2s3m","1w1o","2r4g","2s4s","1x4o","2r48","2s4m","1wxo","2r44","1wu6","2r42","2p5c","2r58","2p54","2r52","2p50","2p4y","2l74","2p64","2l6w","2p5y","2l6s","2l6q","2dao","2l7w","2dag","2l7q","2dac","1tj4","2bcg","2k8s","1t5s","2b5k","2k5a","1sz4","2b24","1svs","2b0e","1su4","2s14","1tyo","2bjw","2s10","1trs","2bge","2s0y","1toc","1tmm","2qy0","2s1i","1u64","2qxw","1u2m","2qxu","2ors","2qye","2oro","2orm","2kfc","2os6","2kf8","2kf6","2bqg","2kfq","2bqc","2bqa","1sdc","2arc","2jy6","1s6o","2anw","1s3c","2am6","1s1o","1s0u","2rzo","1sl4","2av2","2rzm","1sho","1sfy","2qus","1sou","2quq","2ol0","2oky","2k1g","2k1e","2ayc","2aya","1rsg","2ags","1rp4","2af2","1rng","1rmm","2ryy","1rwc","1rum","2qt6","2ohm","2jui","1ri0","2abi","1rgc","1rfi","1rjy","1rcs","1rby","1n7k","286o","2inw","1mu8","27zs","2ike","1mnk","27wc","1mk8","27um","1mik","2ru0","1nn4","28e4","2rtw","1ng8","28am","2rtu","1ncs","1nb2","2qjs","2rue","1nuk","2qjo","1nr2","2qjm","2nzc","2qk6","2nz8","2nz6","2iug","2nzq","2iuc","2iua","28ko","2iuu","28kk","28ki","2ehs","2ltk","2pha","1zgg","2eb4","2lq4","1za8","2e7s","2loe","1z74","2e64","1z5k","2e5a","1z4s","1m1s","27lk","2ida","209s","1lv4","27i4","2034","2em4","27ge","1zzs","1lq4","1zy4","1lpa","1zxa","2rsk","1m9k","27pa","2s8k","2rsi","20hk","1m64","2s8i","20e4","1m4e","20ce","2qgk","1mda","2rck","2qgi","20la","2rci","2nsk","2pkk","2nsi","2pki","2igk","2m0k","2igi","2m0i","27sk","27si","1yo0","2dww","2lj0","1yhs","2dtk","2lha","1yeo","2drw","1yd4","2dr2","1ycc","1yby","1lgw","27b0","1ywg","1ldk","279a","1yt4","2dz2","1yrg","1lb2","1yqm","2rru","1lks","2s6y","1z0c","1lj2","1yym","2qey","2r96","2np6","2pdm","2i9m","2lmi","27ei","1y3k","2dmg","2ldq","1y0g","2dks","1xyw","2djy","1xy4","1xxq","1l6g","275q","1y7s","1l4s","1y64","1l3y","1y5a","1l8e","1y9q","1xtc","2dh8","1xrs","2dge","1xr0","1xqm","1l18","1xvg","1l0e","1xum","1xo8","2dem","1xng","1xn2","1kym","1xpa","1xlo","1xla","1iw0","260o","2hku","1ipc","25x8","1im0","25vi","1ikc","1iji","2rp0","1j3s","264e","2roy","1j0c","1iym","2q9g","1j7i","2q9e","2nec","2nea","2ho4","2ho2","267o","267m","1p6o","2968","2j5o","1p0g","292w","2j3y","1oxc","2918","1ovs","290e","1ov0","1oum","1ib4","25q4","1pf4","1i7s","25oe","1pbs","298e","1pa4","1i5a","1p9a","2roa","1if0","2rwa","1pj0","1ida","1pha","2q7u","2qnu","2nay","2o6y","2hh6","2j96","25tm","2fhc","2mbc","2pq6","21mo","2fe8","2m9o","21k0","2fco","2m8u","21io","2fbw","21i0","2fbi","21ho","1om8","28vs","2j0e","221s","1oj4","28u4","21yo","2fjw","28ta","21x4","1ogs","21wc","1oge","21vy","1i0o","25ku","1oqg","1hz0","2260","1oos","1hy6","224c","1ony","223i","1i2m","1ose","227y","218g","2f74","2m64","215s","2f5k","2m5a","214g","2f4s","213s","2f4e","213g","213a","1oc0","28qk","21dc","1oag","28pq","21bs","2f8e","21b0","1o9a","21am","1hvg","1oe4","1hum","21fg","1oda","21em","20yo","2f20","2m3i","20xc","2f18","20wo","2f0u","20wc","20w6","1o6w","28ny","2114","1o64","210c","1o5q","20zy","1hsu","1o7y","2126","20ts","2ezg","20t4","2ez2","20ss","20sm","1o4c","20v0","1o3y","20um","20rc","2ey6","20r0","20qu","1o32","20ry","20q4","20py","1gq8","24xo","1gmw","24vy","1gl8","1gke","1gu4","1gse","2q4a","2n3u","2h2y","2516","1jvk","26ig","2htq","1jsg","26gs","1jqw","26fy","1jq4","1jpq","1gfs","24se","1jzs","1ge4","1jy4","1gda","1jxa","1ghq","1k1q","1q68","29o0","2jek","1q3k","29mg","2jdq","1q28","29lo","1q1k","29la","1q18","1q12","1jlc","26d8","1qb4","1jjs","26ce","1q9k","1jj0","1q8s","1jim","1q8e","1gak","1jng","1g9q","1qd8","1jmm","1qce","2fz4","2mk8","2pum","22ps","2fxs","2mjg","22ow","2fx4","2mj2","22og","2fws","22o8","2fwm","22o4","1pwg","29iw","2jby","22xs","1pv4","29i4","22wg","2g0s","29hq","22vs","1pu4","22vg","1pty","22va","1jg8","26am","1pyw","1jfg","2308","1py4","1jf2","22zg","1pxq","22z2","1g7y","1jha","1pzy","231a","22io","2fu8","2mho","22hs","2ftk","2mha","22hc","2ft8","22h4","2ft2","22h0","22gy","1prk","29gc","22ls","1pqw","29fy","22l4","2fv2","22ks","1pqe","22km","1jdo","1pss","1jda","22n0","1pse","22mm","22e8","2frs","2mge","22ds","2frg","22dk","2fra","22dg","22de","1pp4","29f2","22fs","1pos","22fg","1pom","22fa","1jce","1ppq","22ge","22c0","2fqk","22bs","2fqe","22bo","22bm","1pnw","22cs","1pnq","22cm","22aw","2fpy","22as","22aq","1pna","22ba","1fnc","24e6","1flo","1fku","1fpa","1h80","256k","1h6g","255q","1h5o","1h5a","1fi4","1ha4","1fha","1h9a","1kdc","26rc","2hy6","1kc0","26qk","1kbc","26q6","1kb0","1kau","1h2w","253y","1kfs","1h24","1kf0","1h1q","1kem","1ffi","1h3y","1kgu","1qo0","29ww","2jj0","1qn4","29w8","2jim","1qmo","29vw","1qmg","29vq","1qmc","1qma","1k8g","26os","1qr4","1k7s","26oe","1qqg","29xq","1qq4","1k7a","1qpy","1h0c","1k9o","1gzy","1qsc","1k9a","1qry","2g80","2moo","2pwu","2g7k","2moc","2g7c","2mo6","2g78","2g76","1qjk","29ug","2jhq","23ds","1qj4","29u4","23dc","2g98","29ty","23d4","1qis","23d0","1qiq","23cy","1k60","26ni","1ql4","1k5o","23fc","1qks","1k5i","23f0","1qkm","23eu","1gz2","1k6m","1qlq","23fy","2g5s","2mng","2g5k","2mna","2g5g","2g5e","1qhc","29t8","2380","1qh4","29t2","237s","2g6e","237o","1qgy","237m","1k4s","1qi4","1k4m","238s","1qhy","238m","2g4o","2mmu","2g4k","2g4i","1qg8","29sm","2354","1qg4","2350","1qg2","234y","1k46","1qgm","235i","2g44","2g42","1qfo","233o","1qfm","233m","1f3w","1f32","1fw8","24im","1fvg","1fv2","1f1a","1fxa","1hgw","25b0","1hg8","25am","1hfw","1hfq","1fto","1hi4","1fta","1hhq","1km8","26vs","2i0e","1kls","26vg","1klk","26va","1klg","1kle","1heg","259q","1kns","26we","1kng","1hdy","1kna","1fse","1hf2","1koe","2a1c","2jl8","2a14","2jl2","2a10","2a0y","1kk0","26uk","1qz4","2a24","26ue","1qyw","1kjo","1qys","1kjm","1qyq","1hd8","1kks","1hd2","1qzw","1kkm","1qzq","2mqw","2pxy","2mqs","2mqq","2a08","2jkm","2gdk","2a04","2gdg","2a02","2gde","1kiw","26ty","1qw8","1kis","23mw","1qw4","1kiq","23ms","1qw2","23mq","1hcm","1kja","1qwm","23na","2mqc","2mqa","29zo","2gc4","29zm","2gc2","1kic","1qus","1kia","23jo","1quq","23jm","2mq2","29ze","2gbe","1ki2","1qu2","23i2","1f8c","1f7y","1g0o","24ku","1g0c","1g06","1f72","1g1a","1hlc","25d8","1hl4","25d2","1hl0","1hky","1fzg","1hm4","1fza","1hly","26y0","2i1i","26xw","26xu","1hk8","25cm","1krs","26ye","1kro","1hk2","1krm","1fyu","1hkm","1ks6","2jmc","2jma","26xg","2a44","26xe","2a42","1hjo","1kqc","1hjm","1r3o","1kqa","1r3m","2jm2","26x6","2a3e","1hje","1kpm","1r22","1fak","1fae","1g2w","24ly","1g2s","1g2q","1f9y","1g3a","25ec","25ea","1g2c","1ho4","1g2a","1ho2","2i22"]
    ];

    function fill_letters( frm, to ){
         var arr = [];

         for( var i = frm; i <= to; i++ ){
            arr.push( i );
         }

         return arr;
    }

    /**
     * Galois field for 929.
     */

   function equation_multiplier( eqn1, eqn2 ){
      var len = eqn1.length + eqn2.length - 1,
      ret = [];

      for( var i = 0; i < len; i++ ){
         var value = 0;
         for( var j = 0; j <= i; j++ ){
            value += ( eqn1[ j ] || 0 ) * ( eqn2[ i - j ] || 0 );
         }

         ret[ i ] = ( value % 929 + 929 ) % 929;
      }

      return ret;
   }

   function equation_generator( level ){
      var degree = 3,
      first = [ 1, -degree ];

      for( var i = 1; i < level; i++ ){
         degree = ( degree* 3 ) % 929;
         first = equation_multiplier( first, [ 1, -degree ] );
      }

      return first;
   }

   function error_correction( level ){
      var ret = equation_generator( level );
      ret.shift();
      return ret.map( item =>{
         return ( item % 929 + 929 ) % 929
      } ).reverse();
   }

   /**
    * For copying object
    */

   function qr_extend( options, ret ){
      for( var key in options ){
         ret[ key ] = options[ key ];
      }
      return ret;
   }

   /**
    * Main class instance.
    */

   class LyteBarcode_Pdf417{
      constructor( options ){
         options = ( this.options = qr_extend( options || {}, qr_extend( default_options, {} ) ) );

         var text = options.text,
         mode_seqs = this.form_modes( text ),
         encoded = this.encode_sequence( mode_seqs );

         if( encoded[ 0 ] == 900 ){
            encoded.shift();
         }

         var text_length = encoded.length;

         if( 925 < text_length /** 929 - 1 ( symbol Length descriptor) - 4 ( minimum error correction ) */ ){
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false;
         }

         encoded.unshift( text_length + 1 );

         var level = this.error_correction_level( text_length ),
         error_length = Math.pow( 2, level + 1 ),
         total_code_words = text_length + error_length + 1,
         aspect_ratio = options.aspect_ratio,
         row_height = options.row_height,
         // based on the aspect ratio and row height i am finding row and column length
         // cols = Math.max( 1, Math.min( 30, Math.round( ( Math.sqrt( ( ( 69 * row_height / 3 ) + 17 * row_height / 3 ) * ( total_code_words * row_height ) / aspect_ratio ) * aspect_ratio - 69 * row_height / 3 ) * 3 / row_height / 17 ) ) ),
         // With existing column calculation some scanners could not read big images. taken from pdf417 creation plugin
         cols = Math.max( 1, Math.min( 30, Math.round( ( Math.sqrt( 4761 + ( 68 * aspect_ratio * row_height * total_code_words ) ) - 69 ) / 34 ) ) ),
         rows = Math.max( 3, Math.min( 90, Math.ceil( total_code_words / cols ) ) ),
         present_data = cols * rows,
         canvas = options.canvas || document.createElement( "canvas" );

         if( present_data > 928 ){
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false; // need to do some alternative here
         }

         this.fill_padd( encoded, present_data - total_code_words );
         
         this.apply_corrections( encoded, error_length );

         this.init( rows, cols );

         this.fill_data( encoded, level, rows, cols );

         this.draw_in_canvas( canvas, options, cols );
         this.canvas = canvas;
      }

      /**
       * Final drawing in canvas.
       */

      draw_in_canvas( canvas, options, columns ){
         var pts = this.points,
         len = pts.length,
         fill_color = options.fill_color, 
         non_fill_color = options.non_fill_color, 
         quiet_zone = options.quiet_zone, 
         background = options.background, 
         before_draw = options.onBeforeDraw,
         scale = options.scale,
         aspect_ratio = options.aspect_ratio,
         row_height = options.row_height * scale,
         width = options.width,
         height = options.height,
         ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
         unit_x,
         unit_y,
         column_len = 69 + columns * 17;

         if( width == void 0 ){
            if( height != void 0 ){
               width = aspect_ratio * height * scale;
            } else {
               width = column_len * row_height / aspect_ratio;
            }
         } else {
            width *= scale;
         }

         if( height == void 0 ){
            height = width / aspect_ratio;
         } else {
            height *= scale;
         }

         unit_x = width / column_len;
         unit_y = height / len;

         width += quiet_zone * 2 * unit_x;
         height += quiet_zone * 2 * unit_x;

         canvas.width = width;
         canvas.height = height;

         if( background ){
            ctx.fillStyle = background;
            ctx.fillRect( 0, 0, width, height );
         }

         before_draw && before_draw( canvas, this );

         for( var row_index = 0; row_index < len; row_index++ ){
            var row = pts[ row_index ],
            cols = row.length;

            for( var col_index = 0; col_index < cols; col_index++ ){
               var col = row[ col_index ];

                ctx.fillStyle = col.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  col_index ) * unit_x, ( quiet_zone * unit_x + row_index * unit_y ), unit_x, unit_y );
                ctx.fill();
                ctx.beginPath();
            }
         }
      }

      /**
       * Filling All the encoded data, error corrections, row indicators
       */

      fill_data( encoded, level, rows, cols ){

         var count = 0;

         for( var i = 0; i < rows; i++ ){
            var cluster_id = i % 3,
            left_row_indicator = this.find_left_row( cluster_id, level, rows, cols, i ),
            right_row_indictor = this.find_right_row( cluster_id, level, rows, cols, i );
            this.fill_individual_data( left_row_indicator, i, 17, "start_row_indicator" );
            this.fill_individual_data( right_row_indictor, i, this.__end_limit - 16, "end_row_indicator" );
            
            for( var j = 0; j < cols; j++ ){
               this.fill_individual_data( parseInt( cluster[ cluster_id ][ encoded[ count ] ], 36 ), i, ( j + 2 ) * 17, "data" );
               count++;
            }
         }
      }

      /**
       * Filling individual columns.
       * Data to be filled, left and top position, type to be filled
       */

      fill_individual_data( data, x, y, type ){
          var split = data.toString( 2 ).padStart( 17, "0" ).split( "" ),
          len = split.length,
          pts = this.points,
          row = pts[ x ];

          for( var i = 0; i < len; i++ ){
             var cur_pt = row[ y + i ];
             
             cur_pt.is_filled = true;
             cur_pt.type = type;

             cur_pt.fill = split[ i ] == "1";
          }
      }

      /**
       * Finding cluster value for right row indicators
       */

      find_right_row( cluster_id, level, rows, cols, row ){
         var row_index;

         switch( cluster_id ){
            case 0 : {
               row_index = 30 * parseInt( row / 3 ) + cols - 1;
            }
            break;
            case 1 : {
               row_index = 30 * parseInt( row / 3 ) + parseInt( ( rows - 1 ) / 3 );
            }
            break;
            case 2 : {
               row_index = 30 * parseInt( row / 3 ) + level * 3 + ( rows - 1 ) % 3;
            }
            break;
         }

         return parseInt( cluster[ cluster_id ][ row_index ], 36 );
      }

      /**
       * Finding cluster value for left row indicators
       */

      find_left_row( cluster_id, level, rows, cols, row ){
         var row_index;

         switch( cluster_id ){
            case 0 : {
               row_index = 30 * parseInt( row / 3 ) + parseInt( ( rows - 1 ) / 3 );
            }
            break;
            case 1 : {
               row_index = 30 * parseInt( row / 3 ) + level * 3 + ( rows - 1 ) % 3;
            }
            break;
            case 2 : {
               row_index = 30 * parseInt( row / 3 ) + cols - 1;
            }
            break;
         }

         return parseInt( cluster[ cluster_id ][ row_index ], 36 );
      }

      /**
       * Finding error correction values based on the error correction level choosed
       */

      apply_corrections( encoded, level ){
         var error_codes = error_correction( level ),
         len = encoded.length,
         dummy_correction = [];

         for( var i = 0; i < len; i++ ){
            var elem1 = ( encoded[ i ] + ( dummy_correction[ level - 1 ] || 0 ) ) % 929,
            elem2,
            elem3;
            
            for( var j = level - 1; j > -1; j-- ){
               elem2 = ( elem1 * error_codes[ j ] ) % 929;
               elem3 = 929 - elem2;
               dummy_correction[ j ] = ( ( dummy_correction[ j - 1 ] || 0 ) + elem3 ) % 929;
            }

            elem2 = ( elem1 * error_codes[ 0 ] ) % 929;
            elem3 = 929 - elem2;
            dummy_correction[ 0 ] = elem3 % 929;
         }

         var encoded_len = encoded.length;

         for( var i = 0; i < level; i++ ){
            var cur = dummy_correction[ i ];
            if( cur ){
               cur = 929 - cur;
            }

            encoded[ encoded_len + level - i - 1 ] = cur;
         }
      }

      /**
       * Filling extra available space with dummy padding value
       */

      fill_padd( arr, size ){
         for( var i = 0; i < size; i++ ){
            arr.push( 900 );
         }
      }

      /**
       * Finding error correction level based on the character count
       */

      error_correction_level( len ){

         var limits = [
            40,
            40 << 2,
            40 << 3,
            863
         ];

         for( var i = 0; i < 4; i++ ){
            var cur = limits[ i ];

            if( len <= cur ){
               return i + 2; // default is two
            }
         }

         return 8;
      }

      /**
       * Finding different combination of encodes from parsed text input
       */
      encode_sequence( arr ){
         var ret = [],
         len = arr.length,
         byte_encoder;

         for( var i = 0; i < len; i++ ){
            var cur = arr[ i ],
            text = cur.text,
            mode = cur.mode,
            cur_encoded;

            switch( mode ){
               case "text" : {
                  cur_encoded = this.text_encoding( text );
               }
               break;
               case "numeric" : {
                  cur_encoded = this.numeric_encoding( text );
               }
               case "byte" : {
                  byte_encoder = byte_encoder || ( byte_encoder = new TextEncoder() );
                  cur_encoded = Array.from( byte_encoder.encode( text ) );
                  
                  cur_encoded.unshift( cur_encoded.length % 6 == 0 ? 924 : 901 );
               }
               break;
            }

            ret.push.apply( ret, cur_encoded );
         }

         return ret;
      }

      /**
       * Numeric encoding.
       * Numbers are splitted into 44 digit length chunks for processing
       */

      numeric_encoding( text ){ 
         var arr = [];

         while( text ){
            arr.push.apply( arr, this.long_overall_division( '1' + text.slice( 0, 44 ) ) );
            text = text.slice( 44 );
         } 

         return arr;

      }

      /**
       * Converting the long number text to base 900 values. 
       */      

      long_overall_division( text ){
         var ret,
         arr = [];

         while( ret = this.long_division( text ) ){
            if( ret.res ){
               arr.unshift( ret.res );
               text = ret.div.toString();
            } else {
               break;
            }
         }
         // Numeric mode indicator
         arr.unshift( 902 ); 
         return arr;
      }

      /**
       * Dividing 44 digit numbers with 900.
       * Javascript supports upto 16 digit numbers alone. 
       * So normal Division is not possible. Here i am splitting the strings into small chunks and applying the division process
       */

      long_division( text, prev_res ){
         var limit = 1,
         cur = text.slice( 0, limit ),
         next = text.slice( limit );

         if( prev_res ){
            cur = prev_res + cur;
         }

         var parsed = parseInt( cur ),
         __res = parsed % 900,
         __div = parseInt( parsed / 900 );

         if( next ){
             var ret = this.long_division( next, __res );
             return {
               res : ret.res,
               div : __div + ret.div
             }
         } else {
            return {
               res : __res,
               div : __div + ""
            };
         }
      }

      /**
       * Text mode encoding .
       * Applying different text sub modes
       */

      text_encoding( text ){
         var len = text.length,
         def_mod = "a",
         available_sub_modes = [ "a", "l", "m", "p" ],
         cur_index = 0,
         ret = [];

         for( var i = 0; i < len; i++ ){
            var cur_text = text[ i ],
            code = cur_text.charCodeAt( 0 );

            for( var j = 0; j < 4; j++ ){
               var mode_to_check = available_sub_modes[ ( j + cur_index ) %4 ],
               mod_data = text_sub_mode[ mode_to_check ],
               mod_index = mod_data.indexOf( code );

               if( mod_index != -1 ){
                  if( def_mod != mode_to_check ){
                     var next_text = text[ i + 1 ],
                     next_code = next_text ? next_text.charCodeAt( 0 ) : 0;

                     if( next_code && def_mod == "l" && mode_to_check == "a" && text_sub_mode[ def_mod ].indexOf( next_code ) != -1 ){
                        ret.push( 27 );
                     } else if( next_code && mode_to_check == "p" && mod_data.indexOf( next_code ) == -1 ){
                        ret.push( 29 );
                     } else {
                        ret.push.apply( ret, text_mode_shift[ def_mod + '_' + mode_to_check ] );
                        def_mod = mode_to_check;
                        cur_index = ( j + cur_index ) %4;
                     }
                  }

                  ret.push( mod_index );
                  break;
               }
            }
         }

         var ret_len = ret.length,
         final = [ 900 ];

         if( ret_len % 2 == 1 ){
            ret.push( 29 );
            ret_len++;
         }

         for( var i = 0; i < ret_len; i += 2 ){
            var cur = ret[ i ],
            next = ret[ i + 1 ];

            final.push( cur * 30 + next );
         }

         return final;
      }

      /**
       * Finding different type of encoding modes
       */

      form_modes( text ){
         var printable_ascii_regex = /[\x20-\x7e\x09\x0a\x0d]{5,}/,
         numeric_mode = /[0-9]{13,44}/,
         ret = [];

         while( text ){

            var numeric_match = numeric_mode.exec( text ),
            text_match = printable_ascii_regex.exec( text ),
            __mode = "byte",
            __limit = text.length,
            obj = {};

            if( numeric_match ){
                var num_index = numeric_match.index;
                if( num_index ){
                  __limit = Math.min( __limit, num_index );
                } else {
                  __mode = "numeric";
                  __limit = numeric_match[ 0 ].length;
                }
            } 

            if( text_match ){
               var text_index = text_match.index;
               if( text_index ){
                  __limit = Math.min( __limit, text_index );
               } else {
                  __mode = "text";
                  __limit = text_match[ 0 ].length;
               }
            }

            obj.mode = __mode;
            obj.text = text.slice( 0, __limit );
            text = text.slice( __limit );
            ret.push( obj );
         }

         return ret;
      }

      /**
       * Creating empty points
       * Pre filling start and stop pattern here
       */

      init( row, col ){
         var start_pattern = this.individual_bar( "81111113" ),
         end_pattern = this.individual_bar( "711311121" ),
         arr = [],
         col_limit = col * 17 + 2 * 17 /*Two row indicators*/ + 17/* Start pattern */ + 18 /* End pattern */,
         end_pattern_limit = col_limit - 1 - 18;

         this.__end_limit = end_pattern_limit;

         for( var i = 0; i < row; i++ ){
            var __row = [];

            for( var j = 0; j < col_limit; j++ ){
               var obj = {
                  is_filled : false,
                  fill : false,
                  type : void 0
               };

               if( j < 17 ){
                  obj.is_filled = true;
                  obj.fill = start_pattern[ j ] == "1";
                  obj.type = "start_pattern";
               } else if( end_pattern_limit < j ){
                  obj.is_filled = true;
                  obj.fill = end_pattern[ j - end_pattern_limit ] == "1";
                  obj.type = "stop_pattern";
               }

               __row.push( obj );
            }

            arr.push( __row );
         }


         this.points = arr;
      }

      /**
       * Converting value to 17 modules binary data
       */

      individual_bar( str ){
         var len = str.length,
         ret = "";

         for( var i = 0; i < len; i++ ){
            var cur = str[ i ],
            cur_ret = "";
            ret += cur_ret.padEnd( parseInt( cur ), i % 2 == 0 ? 1 : 0 );
         }

         return ret;
      }
   }

   if( typeof $L != "undefined" ){
      $L.pdf417 = ops => {
         return new LyteBarcode_Pdf417( ops );
      };
      $L.pdf417.class_instance = LyteBarcode_Pdf417;
   } else {
      window.LyteBarcode_Pdf417 = LyteBarcode_Pdf417;
   }

})();