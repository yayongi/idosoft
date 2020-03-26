package kr.co.idosoft.common.util;

import java.util.Calendar;
import java.util.Map;

import javax.servlet.http.HttpSession;

/**
 * 
 * @author 유기환
 * @since 2020.03.23
 * @content 관리자 권한 체크
 */

public class commonUtil {
	/**
	 * session 값을 받아 관리자 권한 여부를 return 한다.
	 *
	 * @param HttpSession
	 * @return Boolean
	 */
	public static Boolean isAdmin(HttpSession session){
		
		String param = (String)session.getAttribute("IS_ADMIN");
		
		if("1".equals(param)) {
			return true;
		}
		return false;
	}
	
	/**
	 * 그해 그달의 마지막 일을 계산한다.
	 *
	 * @param String(예시 : 201601)
	 * @return Boolean
	 */
	public static int LastDateInMonth(String date) { 
		
		int _year 	= Integer.parseInt(date.substring(0, 4));
		int _month 	= Integer.parseInt(date.substring(4, 6));
		Calendar tmpCal = Calendar.getInstance();
		tmpCal.set(Calendar.YEAR, _year);
		tmpCal.set(Calendar.MONTH, _month);
		tmpCal.set(Calendar.DATE, 0);

		return (tmpCal.get(Calendar.DATE));
	}
}
