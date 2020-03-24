package kr.co.idosoft.common.util;

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
}
