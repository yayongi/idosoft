package kr.co.idosoft.common.util;

import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;


public class ParamUtils {

	 /**
	  * request를 타고 넘어온 모든 피라미터 문자열 생성
      * @param request
      * @return
      */
    public static String printParameter(HttpServletRequest request){
    	StringBuffer paramsMsg = new StringBuffer();
		String url = request.getRequestURI();
//		if(url.indexOf(".ido") > 0) {
			paramsMsg.append("\n==================== printParameter S ====================\n");
			paramsMsg.append("==== IP : ").append(request.getRemoteAddr()).append("\n");
			paramsMsg.append("==== URL : ").append(url).append("\n");

			Map map = request.getParameterMap();
			if( map != null ){
				Set set = map.keySet();
				Iterator it = set.iterator();
				while( it.hasNext() ){
					String key	 = (String)it.next();
					String value = "";
					if(!StringUtils.isInt(key)) {		// Ajax 통신 중 요청되는 숫자 파라메터는 제거
						if( map.get(key) instanceof String[]) {
							String [] tempStr = (String[]) map.get(key);
							for( String temp : tempStr ){
								value += (value.length()==0?"":",") + temp;
							}
						}else{
							value = map.get(key).toString();
						}
						paramsMsg.append("==== ").append(key).append(" : ").append(value).append("\n");
					}
				}
			}
			paramsMsg.append("==================== printParameter E ====================\n");
//		}
		

		return paramsMsg.toString();
	}
    
    private static String setParamValue(String value, String temp) {
    	StringBuffer valBuf = new StringBuffer();
    	if(value.length() > 0) {
    		valBuf.append(value).append(",").append(temp);
    	} else {
    		valBuf.append(temp);
    	}
    	return valBuf.toString();
    }

    /**
     * 파라미터 리턴
     * @param request
     * @param param		key 값
     * @return
     */
    public static String getParameter(HttpServletRequest request, String param) {
    	return getParameter(request, param, null);
    }

    /**
     * 파라미터 리턴
     * @param request
     * @param param			key 값
     * @param defaultValue	null 일경우 초기화
     * @return
     */
    public static String getParameter(HttpServletRequest request, String param, String defaultValue) {
    	String str = request.getParameter(param);

    	return str==null || "".equals(str)?defaultValue:str;
    }

    /**
     * XSS적용 파라미터 리턴
     * @param request
     * @param param
     * @param defaultValue
     * @return
     */
    public static String getparameterXSS(HttpServletRequest request, String param){
    	return getparameterXSS(request, param, null);
    }

    /**
     * XSS적용 파라미터 리턴
     * @param request
     * @param param
     * @param defaultValue
     * @return
     */
    public static String getparameterXSS(HttpServletRequest request, String param, String defaultValue){
    	String str = request.getParameter(param);

    	return str==null || "".equals(str)?defaultValue:getCleanXSS(str);
    }

    /**
     * 파라미터 리턴
     * @param request
     * @param param			key 값
     * @param defaultValue	null 일경우 초기화
     * @return
     */
    public static String getParameterXSS(HttpServletRequest request, String param, String defaultValue) {
    	String str = request.getParameter(param);

    	return str==null || "".equals(str)?defaultValue:getCleanXSS(str);
    }
    
    /**
     * 파라미터 배열 리턴
     * @param request
     * @param param
     * @return
     */
    public static String[] getParameterValues(HttpServletRequest request, String param){
    	return request.getParameterValues(param);
    }
    
    /*
	 *XSS 대응코드
	 */
	public static String getCleanXSS(String value) {
		String tmpValue = value;
		tmpValue = tmpValue.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
		tmpValue = tmpValue.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
		tmpValue = tmpValue.replaceAll("'", "&#39;");
		tmpValue = tmpValue.replaceAll("eval\\((.*)\\)", "");
		tmpValue = tmpValue.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
		tmpValue = tmpValue.replaceAll("script", "");

		return tmpValue;
	}
	
	/**
	 * MULTIPART 파라미터 로그
	 * @param request
	 * @return
	 */
	public static String printMultiParameter(MultipartHttpServletRequest request){
		StringBuffer paramString = new StringBuffer();
		paramString.append("\n######################################## MULTIPART Parameter LOG START ########################################\n");
		paramString.append("Remote IP : ").append(request.getRemoteAddr()).append("\n"); 
		paramString.append("URL       : ").append(request.getRequestURI()).append("\n");
		
		Map requestMap  = request.getParameterMap();
		
		if(!requestMap.isEmpty()){
			Set set = requestMap.keySet();
			Iterator iter = set.iterator();
			while(iter.hasNext()){
				String key = (String)iter.next();
				StringBuffer value = new StringBuffer();
				if(requestMap.get(key) instanceof String[]){
					String[] stringArray = (String[])requestMap.get(key);
					for(String temp:stringArray){
						value.append((value.length() == 0?"":",")).append(temp);
					}
				}else if(requestMap.get(key) instanceof String){
					value.append((String)requestMap.get(key));
				}
				paramString.append("parameter > ").append( key).append(" : [").append(value.toString()).append("]\n");
			}
		}
		
		Map filesMap  = request.getFileMap();
		if(!filesMap.isEmpty()){
			Set set = filesMap.keySet();
			Iterator iter = set.iterator();
			while(iter.hasNext()){
				String key = (String)iter.next();
				String fileName = "";
				String fileSize = "";
				
				if(filesMap.get(key) == null)continue;
				
				MultipartFile file = (MultipartFile)filesMap.get(key);
				
				fileName = file.getOriginalFilename();
				fileSize = String.valueOf(file.getSize());
				
				paramString.append("file > ").append(key).append(" : ").append(fileName).append("[").append(fileSize).append(" byte]").append("\n");
			}
		}
		
		paramString.append("######################################## MULTIPART Parameter LOG END ########################################\n");
		
		
		return paramString.toString();
	}
	

	public static String printHeader(HttpServletRequest request) {
		StringBuffer paramsMsg = new StringBuffer();
		String url = request.getRequestURI();
//		if(url.indexOf(".ido") > 0) {
			paramsMsg.append("\n==================== printHeader S ====================\n");
			paramsMsg.append("==== IP : ").append(request.getRemoteAddr()).append("\n");
			paramsMsg.append("==== URL : ").append(url).append("\n");

			Enumeration e = request.getHeaderNames();
			while( e.hasMoreElements() ){
				String key	 = (String)e.nextElement();
				String value = "";
				value = request.getHeader(key);
				paramsMsg.append("==== ").append(key).append(" : ").append(value).append("\n");
			}
			paramsMsg.append("==================== printHeader E ====================\n");
//		}
		return paramsMsg.toString();
	}
	
	public static String getHeader(HttpServletRequest request, String headerName) {
		String key = null;
		String value = null;
		Enumeration e = request.getHeaderNames();
		while( e.hasMoreElements() ){
			key	 = (String)e.nextElement();
			if(headerName.equalsIgnoreCase(key)) {
				value = request.getHeader(key);
				break;
			}
		}
		return value;
	}
}