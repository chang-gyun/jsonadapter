<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<style>
.scrolltbody {
    display: block;
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;
}

.scrolltbody td { border: 1px solid #000; border-top: 0; }
.scrolltbody tbody {
    display: block;
    height: 200px;
    overflow: auto;
}

.scrolltbody th:last-child { width: 400px; }
.scrolltbody td:last-child { width: calc( 100px - 10px );  }
</style>

<script type="text/javascript" src="/html/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/html/adapter/json_adapter.js"></script>
<script>
var db = new JsonAdapter();
var util = new UtilAdapter();
var tArr = new Array();
var sessid = '';


$(document).ready(function(){0
		
	test2();
	
	
});

function test(){
	
	var id = $('#id').val();
	var sp = {
			sp_name:'getBookList',
			sp_param:{
				id:id
			}
	}
	data = db.getDBFunc(sp);
	
	log(data);
	//var total_cnt =data.data[0].total_cnt; 
	
}

function test2(){
	
	var param = serializeArrayToJson('formsave');
	var sp = {
			sp_name:'setBook',
			sp_param:param
	}
	
	data = db.setDBFunc(sp);
	
	log(data);
	
}


function serializeArrayToJson(formArray) {//serialize data function


	 var dataArray = $("#"+formArray).serializeArray(),
	     len = dataArray.length,
	     dataObj = {};
	  
	 for (i=0; i<len; i++) {
	   dataObj[dataArray[i].name] = dataArray[i].value;
	 }
	 
	 return dataObj;
	 

	  
}
</script>
<title>Insert title here</title>
</head>

<body>
<form method="post" action="/api">

<input type="button" name="jquery" value="jquery">

<table>
	<tr>
		<td>sp_name</td>
		<td><input type="text" name="sp_name" value="getBookList"></td>
	</tr>
	<tr>
		<td>sp_param</td>
		<td><input type="text" name="sp_param" value="{id:A1}"></td>
	</tr>
	<tr>
		<td>send</td>
		<td><input type="submit"></td>
	</tr>
	<tr>
		<td>jquery</td>
		<td><input type="button" name="test()" onclick="test()"></td>
	</tr>

</table>
</form>
<form id="formsave" method="post" action="/api">
<table>
	
	<tr>
		<td></td>
		<td><input type="text" id="id" name="id" value="A3"></td>
	</tr>
	<tr>
		<td></td>
		<td><input type="text" name="name" value="데이빗"></td>
	</tr>
	
	<tr>
		<td></td>
		<td><input type="text" name="writer" value="david"></td>
	</tr>
	
	<tr>
		<td></td>
		<td><input type="text" name="price" value="200000"></td>
	</tr>
	<tr>
		<td></td>
		<td><input type="text" name="genre" value="추리"></td>
	</tr>
	<tr>
		<td></td>
		<td><input type="text" name="publisher" value="출판사"></td>
	</tr>
	
	<tr>
		<td>send</td>
		<td><input type="submit"></td>
	</tr>
	<tr>
		<td>jquery</td>
		<td><input type="button" name="test2()" onclick="test2()"></td>
	</tr>

</table>


</form>
</body>
</html>