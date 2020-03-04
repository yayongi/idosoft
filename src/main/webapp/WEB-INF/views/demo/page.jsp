<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>

<script type = "text/javascript">
console.log("<%= request.getContextPath() %>");

console.log("<%= request.getRequestURL() %>");

console.log("<%= request.getRequestURI() %>");

console.log("<%= request.getServletPath() %>");
</script>

<html>
    <head>
        <title>${pageName}</title>
    </head>

    <body>
        <div id="root"></div>
        <script src="/resources/react/${pageName}.bundle.js"></script>
    </body>
</html>