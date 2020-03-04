<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

 
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<h1>
	Hi Guys! Here is IDO SOFT   
</h1>

<div>ListCnt : ${testCnt} </div>

<div>
	<table>
	<caption>목록</caption>
		<colgroup>
			<col style="width:10%;">
			<col style="width:20%;">
			<col style="width:20%;">
			<col style="width:20%;">
			<col style="width:20%;">
			<col style="width:10%;">
		</colgroup>
		<thead>
			<tr>
				<th scope="col">번호</th>
				<th scope="col">이름</th>
				<th scope="col">생년월일</th>
				<th scope="col">이메일</th>
				<th scope="col">전화번호</th>
				<th scope="col">직책</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${testList}" var="vo">
				<tr align="center">
					<td>${vo.seq}</td>
					<td>${vo.name}</td>	
					<td>${vo.birth}</td>
					<td>${vo.email}</td>
					<td>${vo.phone}</td>
					<td>${vo.position}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>


</body>
</html>