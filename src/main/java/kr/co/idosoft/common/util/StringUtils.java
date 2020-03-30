package kr.co.idosoft.common.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import com.google.gson.Gson;

public class StringUtils {
	/**
	* original source: eGov > egovframework.com.cmm.EgovWebUtil.filePathBlackList
	*/
	public static String filePathBlackList(String value) {
		String returnValue = value;
		if (returnValue == null || returnValue.trim().equals("")) {
			return "";
		}

		returnValue = returnValue.replaceAll("\\.\\./", ""); // ../
		returnValue = returnValue.replaceAll("\\.\\.\\\\", ""); // ..\

		return returnValue;
	}

	public static String nvl(String value, String changeValue) {
		return value==null?changeValue:value;
	}


	/**
	* Null, 공백 체크
	* @param str
	* @return
	*/
	public static boolean notNull(String str){
		boolean flag = false;

		if(str != null && !"".equals(str)){
			flag = true;
		}

		return flag;
	}

	public static boolean isNull(String str){
		boolean flag = false;

		if(str == null || "".equals(str)){
			flag = true;
		}

		return flag;
	}


	/**
	* str 공백이나 null 이면 공백으로 대체
	* @param tmpStr
	* @return
	*/
	public static String changeEmpty(String str) {
		String tmpStr = str;
		if(tmpStr != null && !"".equals(tmpStr)){
			tmpStr = tmpStr.trim();
		}else{
			tmpStr = "";
		}

		return tmpStr;
	}

	/**
	* str 공백이나 null 이면 DEFAULT str 로 대체
	* @param tmpStr
	* @param def
	* @return
	*/
	public static String changeEmpty(String str, String def) {
		String tmpStr = str;
		String tmpDef = def;
		if(tmpStr != null & !"".equals(tmpStr)){
			tmpStr = tmpStr.trim();
		}else{
			tmpStr = tmpDef;
		}

		return tmpStr;
	}
    
	/**
	* str to Array Token
	* @param str
	* @param def
	* @return
	*/
    public static String[] getTokenElement(String rsStr,String flag){
        StringTokenizer stok    = new StringTokenizer(rsStr,flag);
        String[]        sTokens = new String[stok.countTokens()];
        for (int i = 0; stok.hasMoreElements();i++){
            sTokens[i] = ((String)stok.nextElement()).trim();
        }
        return sTokens;
    }
    /**
     * isInt
     * 숫자 여부 확인
     * @param str
     * @return
     */
    public static boolean isInt(String str) {
    	boolean result = true;
    	try{
    		Integer.parseInt(str);
    	} catch (Exception e) {
    		result = false;
    	}
    	return result;
    }
    /**
     * 문자열 추가 처리
     * @param sourceStr	소스 내용
     * @param appendStr	추가할 내용
     * @param seperator 구분자
     * @return 합쳐진 내용
     */
    public static String appendStr(String sourceStr, String appendStr, String seperator) {
		StringBuffer sb = new StringBuffer();
		if(sourceStr == null || "".equals(sourceStr)) {
			sb.append(appendStr);
		} else {
			sb.append(sourceStr).append(seperator).append(appendStr);
		}
		return sb.toString();
	}
    
    /**
	 * isNotEmpty
	 * 
	 * <pre>
	 * 문자열이 비어있지 않다면 True(공백이 붙을 경우 trim하여 체크)
	 * </pre>
	 * 
	 * @param strCheckTarget
	 * @return
	 * @author LivePortal
	 */
	public static boolean isNotEmpty(String strCheckTarget) {
		boolean bolResultValue = false;
		if (strCheckTarget != null) {
			if (!"".equals(strCheckTarget.trim())) {
				bolResultValue = true;
			}
		}
		return bolResultValue;
	}
	
	 /**
		 * strToTime
		 * 
		 * <pre>
		 * DB에 들어있는 분초값 데이터를 00:00 과 같은 형태로 반환
		 * </pre>
		 * 
		 * @param strCheckTarget
		 * @return
		 * @author LivePortal
		 */
	public static String strToTime(String str){
		StringBuilder sb = new StringBuilder();
		sb.append(str.substring(0, 2));
		sb.append(":");
		sb.append(str.substring(2));
		return sb.toString();
	}
	/**
	 * 배열을 String으로 변환
	 * @param arrStr
	 * @param split
	 * @return
	 */
	public static String arrToStr(String[] arrStr, String split) {
		StringBuffer sb = new StringBuffer();
		if(arrStr != null && arrStr.length > 0) {
			for(int i=0; i<arrStr.length; i++) {
				sb.append(arrStr[i]).append(changeEmpty(split));
			}
		}
		return sb.toString();
	}
	/**
	* 앞에 len만큼의 0을 붙인다.
	* @param len
	* @param target
	* @return String
	*/
	public static String addZero(int len,int target){
		String targetStr = String.valueOf(target);
		String result = "";
		int length = targetStr.length();
		if(length != len){
			for(int index=0;index<len-length;index++){
				result += "0";
			}
			result += targetStr;
		}else{
			result = targetStr;
		}

		return result;
	}
	/**
	* 앞에 len만큼의 0을 붙인다.
	* @param len
	* @param target
	* @return String
	*/
	public static String addZero(int len,String target){
		String targetStr = String.valueOf(target);
		String result = "";
		int length = targetStr.length();
		if(length != len){
			for(int index=0;index<len-length;index++){
				result += "0";
			}
			result += targetStr;
		}else{
			result = targetStr;
		}

		return result;
	}
	/**
	 * 
	 */
	public static String toJson(List reqList) {
		Gson gson = new Gson();
		String resString = gson.toJson(reqList);

		return resString;
	}

	public static String mapToJson(Map reqMap) {
		Gson gson = new Gson();
		return gson.toJson(reqMap);
	}

	public static List fromJson(String reqString) {
		Gson gson = new Gson();

		List<HashMap> resultList = null;
		resultList = gson.fromJson(reqString, List.class);

		return resultList;
	}

	public static Map fromJsonMap(String reqString) {
		Gson gson = new Gson();
		return gson.fromJson(reqString, HashMap.class);
	}
	
	//한글유니코드(\uAC00-\uD7A3), 숫자 0~9(0-9), 영어 소문자a~z(a-z), 대문자A~Z(A-Z), 공백(\s) 외에 제거
	public static String StringReplace(String str){
		String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
		str =str.replaceAll(match, "");
		return str;
	}
	//1칸이상의 공백을 기준으로 String을 나누어 List로 반환 
	public static List<String> arStrRegexMultiSpace (String str){
		String[] strArr = str.split("\\s+");
		return new ArrayList<>(Arrays.asList(strArr));
	}
}

	