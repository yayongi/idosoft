package kr.co.idosoft.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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
	 * @return int
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
	
	/**
	 * 그달의 몇째 주인지 계산
	 *
	 * @param String(예시 : 2016-01-01)
	 * @return int
	 */
	public static int getWeekOfYear(String date) {
		
		Calendar calendar = Calendar.getInstance();
		String[] dates = date.split("-");
		int year = Integer.parseInt(dates[0]);
		int month = Integer.parseInt(dates[1]);
		int day = Integer.parseInt(dates[2]);
		calendar.set(year, month - 1, day);
		return calendar.get(Calendar.DAY_OF_WEEK_IN_MONTH);
	}
	
	/**
	 * 특정 날짜에 대하여 요일을 구함(일 ~ 토)
	 * @param date(예시 : 2016-01-01)
	 * @return
	 * @throws Exception
	 */
	public static String getDateDay(String date) throws Exception {

		String day = "" ;

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd") ;
		Date nDate = dateFormat.parse(date) ;

		Calendar cal = Calendar.getInstance() ;
		cal.setTime(nDate);

		int dayNum = cal.get(Calendar.DAY_OF_WEEK) ;

		switch(dayNum){
		case 1:
			day = "일";
			break ;
		case 2:
			day = "월";
			break ;
		case 3:
			day = "화";
			break ;
		case 4:
			day = "수";
			break ;
		case 5:
			day = "목";
			break ;
		case 6:
			day = "금";
			break ;
		case 7:
			day = "토";
			break ;
		}

		return day ;
	}


}
