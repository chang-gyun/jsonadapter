
function viewLog(ret){
	
	console.log(ret);
}

function nowdatetime(){
	
	var d = new Date();
	var month = d.getMonth() < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
	var day = d.getDate() < 10?'0'+d.getDate()  : d.getDate() ;
	var hour = d.getHours() <10?'0'+d.getHours()  : d.getHours() ;
	var min = d.getMinutes() <10?'0'+d.getMinutes()  : d.getMinutes() ;
	var sec = d.getSeconds() <10?'0'+d.getSeconds()  : d.getSeconds() ;
	var nowdate = d.getFullYear() +'-'+ month +'-'+ day +' '+ hour +':'+ min +':'+ sec ;
	
	return nowdate;

}

function log(ret){
	
	console.log('JSONADAPTER ::::: ' +nowdatetime());
	console.log(ret);
	console.log('JSONADAPTER ::::: '+document.URL);
}

function view(ret){
	console.log(ret);
}

function JsonAdapter(){

	this.path = '/api';
	this.getDBFunc = function(sp){
		
		var sp_name = sp.sp_name;
		var sp_param = sp.sp_param;
		var sp_paging = sp.sp_paging;
		var sp_type = sp.sp_type;
		var sp_async = sp.sp_async;
		var sp_decode = sp.sp_decode;
		var sp_callback = sp.sp_callback;
		if(!sp_async){
			sp_async = false;
		}
		

		var sp_param = JSON.stringify(sp_param);
		//console.log(typeof test);
		//console.log(test);
		
		

		var retUrl ='';

		if(sp_type=='custom'){
			sp_type = 'getDBCust';
		}else{
			sp_type = 'getDBFunc';
		}


		var retval = '';
		var param_tail='';
		if(sp_paging){
			
			var sp_paging_temp ='';
			for (key in sp_paging) {
				
				if(key.length ==1){ //value만넘어올때
					sp_paging_temp += sp_paging[key] + '|'	 
				}else{
					sp_paging_temp += key +':'+ sp_paging[key] + '|'	
				}
			} 
			
			sp_paging = sp_paging_temp.substring(0, sp_paging_temp.length-1);
			param_tail = '&sp_paging='+sp_paging;
		}
		
		
		
		var geturl = this.path;
		var getData = "sp_type="+sp_type+"&sp_name="+sp_name+"&sp_param="+sp_param+param_tail+"&sp_decode="+sp_decode+"&nd="+new Date().getTime();
		
		viewLog('JSONADAPTER::http://localhost:8080'+geturl+'?'+getData);
		
		 $.ajax({
	        url: geturl,
	        type:'post',
	        data:getData,
	        dataType: 'json',
	        async: sp_async,
	        beforeSend:function(){
	        		
			},
	        success: function(data) {
	        	// if async true
	    		if(sp_callback){
					var func = new Function("return function(data){"+sp_callback+"(data);}")();
					func(data);
				// if async false
				}else{
					retval = data;
				}
				//$('#ajaxLoaderImg').hide;	
	        },
			error : function(){
				viewLog("JSONADAPTER : ERROR");
				viewLog(geturl);
				//$('#ajaxLoaderImg').hide;
			}
	    });


		return retval;
	};


	this.setDBFunc = function(sp){

		var sp_name = sp.sp_name;
		var sp_param = sp.sp_param;
		var retval ='';
		var sp_form = '';
		
		var sp_param = JSON.stringify(sp_param);
		
		var geturl = this.path;
		
		var setData = "sp_type=setDBFunc&sp_name="+sp_name+"&sp_param="+sp_param+"&nd="+new Date().getTime();
		
		viewLog('JSONADAPTER::http://localhost:8080'+geturl+'?'+setData);
		
		var setData = {
			sp_type:'setDBFunc',
			sp_name:sp_name,
			sp_param:sp_param,
			nd:new Date().getTime()
		}
		

		$.ajax({
			url : geturl,
			type:'post',
			data: setData,
			dataType : 'json',
			async : false,
			success : function(data) {
				viewLog(data);
				retval = data;
				viewLog(data);

			},
			error : function(){
				viewLog("ERROR!!!!!!!!.");
			}
		});

		return retval;
	};
	
	
	
}


/* 각종유틸 */
function UtilAdapter(){
	
	this.path = '/api';
	
	/* malsup.com */
	this.ajaxForm = function(sp){
		
	var formid = sp.formid;
	var callback = sp.callback;
	var validchk = sp.validchk;
	
	var geturl = this.path;
	var ret_value ='';
	var retArr = new Array();

	 var options = { 
        url:geturl, 
        success: callback, 
        beforeSubmit : validchk,
        timeout:   3000 
    }; 
	
	$('#'+formid).ajaxForm(options); 

	/*
	 //source
	 util.ajaxForm({formid:'frm',callback:setPhoto});
	 
	 function setPhoto(responseText, statusText, xhr) {
	 	var retxt = responseText;
    	retxt = retxt.substring(0,retxt.length-1);
    	
    	var uploadimg = [];
   		var imgs = retxt.split('|');
   		
    	if(imgs){
    		
    		for(var i = 0 ; i < imgs.length ; i++){
				
				imgv = imgs[i].split('^');
				uploadimg[imgv[0]] = imgv[1];
				
			}
    		
    	}
	 }
	 * */
	
	
		
		
	};
	
	/* 금액콤마 */
	this.comma = function(srcNumber){

		if(srcNumber==null) return 0;

    	var txtNumber = srcNumber.toString();

    	if (!isNaN(txtNumber) && txtNumber != ""){
    		
        	var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

        	var arrNumber = txtNumber.split('.');

        	arrNumber[0] += '.';

        	do{
            	arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
        	}
        	while (rxSplit.test(arrNumber[0]));

        	if (arrNumber.length > 1)
	            return arrNumber.join('');
        	else
            return arrNumber[0].split('.')[0];
       	}
	};
	
	/* 페이징 */
	this.getPaging = function (total_cnt, currpage, roundpage, roundgrp){
	
		//console.log('전체게시물수_total_cnt:'+total_cnt);
		
		//전체페이지수 : 전체게시물 / 한페이지조회컨텐츠수
		var last_currnum = Math.ceil(total_cnt/roundpage);
			//console.log('전체페이지수_last_currnum:'+last_currnum);
	
		var last_currgrp = Math.ceil(last_currnum/roundgrp);
			//console.log('전체페이지그룹수_last_currgrp:'+last_currgrp);
	
		//현재페이지그룹번호 currpage이용
		var currgrp = Math.floor( (Number(currpage)-1)/roundgrp ) +1;
			//console.log('현재페이지그룹번호_currgrp:'+currgrp);
			//console.log('현재페이지번호_currpage:'+currpage);
	
		
		if(last_currnum < roundgrp){	
			max_roundgrp = last_currnum;
		}else {
			
			if(last_currgrp == currgrp){
			
				///max_roundgrp = total_cnt % (Number(last_currnum)-1);
				max_roundgrp = (total_cnt % (Number(roundpage)) +1);
				if(max_roundgrp==0) max_roundgrp = roundgrp;
			
			}else if(last_currgrp < currgrp){
				max_roundgrp = 0;		
			
			}else{
				max_roundgrp = roundgrp;
				
			}
		}
	
		var pageIndex = [];
		var rows ='';
		//rows += 1 +','; //첫그룹
		//rows += 1; //이전그룹
		for(var i = 0 ; i < max_roundgrp ; i++){
			now = (i + ((currgrp * roundgrp) - roundgrp))+1;
			pageIndex[i] = now; 
			//rows += now + '|';
		}
		//console.log(rows);
		
		//이전그룹페이지번호
		//var before_currpage = ((currgrp-1) * roundgrp) + roundgrp;
		var before_currpage = ((currgrp-1) * roundgrp);
		var beforeG_currpage = 1;
		if(currgrp==1){
			before_currpage =0;
			beforeG_currpage =0;
		}	
		
		//다음그룹페이지번호
		var after_currpage = (currgrp) * roundgrp + 1;
		if(after_currpage > last_currnum)	after_currpage =0;
		
		var afterG_currpage = last_currnum;
		if(after_currpage==0)	afterG_currpage =0; 
	
		var result = {
			'after_currpage':after_currpage,
			'afterG_currpage':afterG_currpage,
			'pageIndex':pageIndex,
			'before_currpage':before_currpage,
			'beforeG_currpage':beforeG_currpage
		}
		
		//console.log(result);
		return result;

		
		
	};
	
	
	/* 페이징디자인 */
	this.setPaging = function (pageArr, currpage){
		
		//console.log(pageArr);
		var rows  = '';
	
		if(pageArr.before_currpage==0){
			rows += '<a href="javascript://" class="prev-all" ></a>';
			rows += '<a href="javascript://" class="prev"  ></a>';
			
		}else{
			rows += '<a href="javascript://" class="prev-all on" onclick="goPage('+pageArr.beforeG_currpage+');"></a>';
			rows += '<a href="javascript://" class="prev on"  onclick="goPage('+pageArr.before_currpage+')";></a>';
			
		}
	
		for(var i = 0 ; i < pageArr.pageIndex.length ; i++){
			
			var on = '';
			if((pageArr.pageIndex[i]) == currpage){
				on = 'on';
			}
			rows += '<a href="javascript://" onclick="goPage('+pageArr.pageIndex[i]+')"  class="number '+on+'">'+pageArr.pageIndex[i]+'</a>';
		
		}
	
		if(pageArr.after_currpage==0){
			rows += '<a href="javascript://"  class="next" );"></a>';
			rows += '<a href="javascript://"  class="next-all" )";></a>';
			
		}else{
			rows += '<a href="javascript://"  class="next on" onclick="goPage('+pageArr.after_currpage+');"></a>';
			rows += '<a href="javascript://"  class="next-all on" onclick="goPage('+pageArr.afterG_currpage+')";></a>';
		}
			
		return rows;
		
	};
	
	/* 페이징디자인 */
	this.setPagingAdmin = function (pageArr, currpage){
		

						
		//console.log(pageArr);
		var rows  = '';
	
		if(pageArr.before_currpage==0){
			rows += '<a href="javascript://" class="prev-all" ></a>';
			rows += '<a href="javascript://" class="prev"  ></a>';
			
		}else{
			rows += '<a href="javascript://" class="prev-all on" onclick="goPage('+pageArr.beforeG_currpage+');"></a>';
			rows += '<a href="javascript://" class="prev on"  onclick="goPage('+pageArr.before_currpage+')";></a>';
			
		}
	
		for(var i = 0 ; i < pageArr.pageIndex.length ; i++){
			
			var on = '';
			if((pageArr.pageIndex[i]) == currpage){
				on = 'this';
			}
			rows += '<li class="'+on+'"><a href="javascript://" onclick="goPage('+pageArr.pageIndex[i]+')" >'+pageArr.pageIndex[i]+'</a></li>';
		
		}
	
		if(pageArr.after_currpage==0){
			rows += '<a href="javascript://"  class="next" );"></a>';
			rows += '<a href="javascript://"  class="next-all" )";></a>';
			
		}else{
			rows += '<a href="javascript://"  class="next on" onclick="goPage('+pageArr.after_currpage+');"></a>';
			rows += '<a href="javascript://"  class="next-all on" onclick="goPage('+pageArr.afterG_currpage+')";></a>';
		}
			
		return rows;
		
	};
	
	
	/* 페이징화면이동 */
	this.goPage = function (currpage, req){
		
		var returl='?';
	
		for (key in req) {
			
			if(key!='currpage'){
				returl += key +'='+ req[key] + '&';	
			}
		}
		
		returl+= 'currpage='+currpage;
		
		
		location.href = returl;
	};
	
	
	/* 파라미터추출 */
	this.getParameter = function (req){
		
		var returl='';
	
		for (key in req) {
			
				returl += key +'='+ req[key] + '&';	
			
		}
		
		return returl;
	};
	

	/* 정규표현식변환 */
	this.replaceHtml = function (str){
		
		str = str.replace(/</g,"&lt;");
		str = str.replace(/>/g,"&gt;");
		str = str.replace(/\"/g,"&quot;");
		str = str.replace(/\'/g,"&#39;");
		str = str.replace(/\n/g,"<br />");
		return str;
		
	};
	
	/* 날짜조회 */
	this.nowDate = function (num, division){
		
		var d = new Date();
		
		if(!division){
			division = 'm';
			num = 0;
		}

		if(division=='y'){
			d.setYear(d.getFullYear() + num);
			d.setMonth(d.getMonth() +1);
		}else if(division=='m'){
			d.setMonth(d.getMonth() + (1+num));
		}else if(division=='d'){
			d.setMonth(d.getMonth() +1);
			d.setDate(d.getDate() + num);
			
		}else{
			
		}
		
		var month = d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth();
		var day = d.getDate() < 10?'0'+d.getDate()  : d.getDate() ;
		var nowdate = d.getFullYear() +'-'+ month +'-'+ day;
		
		return nowdate;
		
	};
	
	
	this.nowDateTime = function (){
		var d = new Date();
		var month = d.getMonth() < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
		var day = d.getDate() < 10?'0'+d.getDate()  : d.getDate() ;
		var hour = d.getHours() <10?'0'+d.getHours()  : d.getHours() ;
		var min = d.getMinutes() <10?'0'+d.getMinutes()  : d.getMinutes() ;
		var sec = d.getSeconds() <10?'0'+d.getSeconds()  : d.getSeconds() ;
		var nowdate = d.getFullYear() +''+ month +''+ day + hour + min + sec ;
		
		return nowdate;
		
	};
	
	
	/* 날짜간 interval 조회 */
	this.intervalDate = function (startTime, endTime){
		
		//var startTime = "20170417191500";
		//var endTime  = "20170417192000";
		   
		// 시작일시 
		var startDate = new Date(parseInt(startTime.substring(0,4), 10),
			 parseInt(startTime.substring(4,6), 10)-1,
			 parseInt(startTime.substring(6,8), 10),
			 parseInt(startTime.substring(8,10), 10),
			 parseInt(startTime.substring(10,12), 10),
			 parseInt(startTime.substring(12,14), 10)
		);
		            
		// 종료일시 
		var endDate   = new Date(parseInt(endTime.substring(0,4), 10),
			 parseInt(endTime.substring(4,6), 10)-1,
			 parseInt(endTime.substring(6,8), 10),
			 parseInt(endTime.substring(8,10), 10),
			 parseInt(endTime.substring(10,12), 10),
			 parseInt(endTime.substring(12,14), 10)
		);
		
		// 두 일자(startTime, endTime) 사이의 차이를 구한다.
		var dateGap = endDate.getTime() - startDate.getTime();
		var timeGap = new Date(0, 0, 0, 0, 0, 0, endDate - startDate); 
		   
		// 두 일자(startTime, endTime) 사이의 간격을 "일-시간-분"으로 표시한다.
		var diffDay  = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수       
		var diffHour = timeGap.getHours();       // 시간 
		var diffMin  = timeGap.getMinutes();      // 분
		var diffSec  = timeGap.getSeconds();      // 초
		   
		 
		   
		// 출력 : 샘플데이타의 경우 "273일 4시간 50분 10초"가 출력된다.
		//alert(diffDay + "일 " + diffHour + "시간 " + diffMin + "분 "  + diffSec + "초 ");
		
		var day = 0;
		if(diffDay < 10 && diffDay >0){
			day = '0'+diffDay;
		}else{
			day = diffDay;
		}
		
		var hour = diffHour <10?'0'+diffHour  : diffHour ;
		var min = diffMin <10?'0'+diffMin  : diffMin ;
		var sec = diffSec <10?'0'+diffSec  : diffSec ;
		
		var ret = {
			'day':day,
			'hour':hour,
			'min':min,
			'sec':sec
		}  
		
		return ret;
		
	};


	/* 광역자치단체 */
	this.sido_eng = function (){
		
		sidoArr = {
			'Seoul':'서울',
			'Busan':'부산',
			'Incheon':'인천',
			'Daegu':'대구',
			'Gwangju':'광주',
			'Daejeon':'대전',
			'Ulsan':'울산',
			'Sejong':'세종',
			'Gyeonggi':'경기도',
			'Gangwon':'강원도',
			'ChungBuk':'충청북도',
			'ChungNam':'충청남도',
			'GyeongBuk':'경상북도',
			'GyeongNam':'경상남도',
			'JeonBuk':'전라북도',
			'JeonNam':'전라남도',
			'Jeju':'제주도'
		}
		
		return sidoArr;
		
	};
	
	/* 광역자치단체 */
	this.sido = function (){

		sidoArr = {
			'1':'서울',
			'8':'부산',
			'3':'인천',
			'10':'대구',
			'14':'광주',
			'6':'대전',
			'9':'울산',
			'17':'세종',
			'2':'경기도',
			'4':'강원도',
			'7':'충청북도',
			'5':'충청남도',
			'11':'경상북도',
			'12':'경상남도',
			'15':'전라북도',
			'13':'전라남도',
			'16':'제주도'
		}
		
		return sidoArr;
		
	};
	
	/* 기초자치단체 */
	this.gugun_eng = function (area){
		
		var gugunArr = new Array();
		gugunArr['Seoul'] = ['강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
		gugunArr['Gyeonggi'] = ['가평군','고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시','양주시','양평군','여주시','연천군','오산시','용인시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'];
		gugunArr['Incheon'] = ['강화군','계양구','남구','남동구','동구','부평구','서구','연수구','옹진군','중구'];
		gugunArr['Gangwon'] = ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'];
		gugunArr['ChungNam'] = ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시','청양군','태안군','홍성군'];
		gugunArr['Daejeon'] = ['대덕구','동구','서구','유성구','중구'];
		gugunArr['ChungBuk'] = ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시','충주시'];
		gugunArr['Busan'] = ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'];
		gugunArr['Ulsan'] = ['남구','동구','북구','울주군','중구'];
		gugunArr['Daegu'] = ['남구','달서구','달성군','동구','북구','서구','수성구','중구'];
		gugunArr['GyeongBuk'] = ['경산시','경주시','고령군','구미시','군위군','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시'];
		gugunArr['GyeongNam'] = ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시','통영시','하동군','함안군','함양군','합천군'];
		gugunArr['JeonNam'] = ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'];
		gugunArr['Gwangju'] = ['광산구','남구','동구','북구','서구'];
		gugunArr['JeonBuk'] = ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시','정읍시','진안군'];
		gugunArr['Jeju'] = [''];
		gugunArr['Sejong'] = [''];
		
		
		return gugunArr[area];
		
	};
	
	/* 기초자치단체 */
	this.gugun = function (area){

		var gugunArr = new Array();
		gugunArr['1'] = ['강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
		gugunArr['2'] = ['가평군','고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시','양주시','양평군','여주시','연천군','오산시','용인시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'];
		gugunArr['3'] = ['강화군','계양구','남구','남동구','동구','부평구','서구','연수구','옹진군','중구'];
		gugunArr['4'] = ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'];
		gugunArr['5'] = ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시','청양군','태안군','홍성군'];
		gugunArr['6'] = ['대덕구','동구','서구','유성구','중구'];
		gugunArr['7'] = ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시','충주시'];
		gugunArr['8'] = ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'];
		gugunArr['9'] = ['남구','동구','북구','울주군','중구'];
		gugunArr['10'] = ['남구','달서구','달성군','동구','북구','서구','수성구','중구'];
		gugunArr['11'] = ['경산시','경주시','고령군','구미시','군위군','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시'];
		gugunArr['12'] = ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시','통영시','하동군','함안군','함양군','합천군'];
		gugunArr['13'] = ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'];
		gugunArr['14'] = ['광산구','남구','동구','북구','서구'];
		gugunArr['15'] = ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시','정읍시','진안군'];
		gugunArr['16'] = [''];
		gugunArr['17'] = [''];
		
		
		return gugunArr[area];
		
	};

}
