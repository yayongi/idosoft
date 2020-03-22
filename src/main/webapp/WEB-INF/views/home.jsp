<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	String contextPath = request.getContextPath();
%>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta name="description" content="아이두소프트 인트라넷" />
<title>IDO SOFT</title>
</head>
<body>
	<div id="root"></div>
	<script type="text/javascript" src="<c:out value='<%=contextPath %>' />/resources/js/vendors.chunk.js.gz"></script>
	<script type="text/javascript" src="<c:out value='<%=contextPath %>' />/resources/js/intranet.bundle.js.gz"></script>
</body>
</html>
