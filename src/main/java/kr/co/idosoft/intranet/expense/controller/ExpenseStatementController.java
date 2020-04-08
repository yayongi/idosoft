package kr.co.idosoft.intranet.expense.controller;

import java.math.BigInteger;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.co.idosoft.common.util.JsonUtils;
import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.expense.model.service.ExpenseStatementServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement Controller
 */
@Controller
public class ExpenseStatementController {
	private static final Logger LOG = LoggerFactory.getLogger(ExpenseStatementController.class);
	
	@Resource
	ExpenseStatementServiceImpl expenseStatementService;
	
	/**
	 * 월별 경비 통계 리스트 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getMonthlyExpense.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getList(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getMonthlyExpense.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		Map<String, Object> data = new HashMap<>();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		String regDate = (String)params.get("regDate");				// 시작 날짜

		LOG.debug("#####################################################################################");
		LOG.debug("# SEARCH DATA ");
		LOG.debug("# regDate 		: " + regDate);
		LOG.debug("#####################################################################################");
		
		String REG_START_DATE 	= ""; // 그달의 시작일 
		String REG_END_DATE		= ""; // 그달의 종료일
		
		REG_START_DATE = regDate + "01";
		// 그달의 마지막 일 구하기
		int lastDate = commonUtil.LastDateInMonth(regDate);
		// 그해의 첫 날
		REG_END_DATE = regDate + String.valueOf(lastDate);
		
		data.put("REG_START_DATE", REG_START_DATE);		// 그달의 시작일
		data.put("REG_END_DATE", REG_END_DATE);			// 그달의 종료일
		
		HttpSession session = request.getSession();
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부

		if(!"1".equals(isAdmin)) {
			mv.addObject("isError", "true");
			mv.addObject("errorMessage", "해당 직원은 권한이 없습니다.");
			return mv;
		}
		
		// 경비 총금액
		String totalAmount = expenseStatementService.getTotalAmount(data);
		
		// 목록 조회
		List<Map<String, Object>> list = expenseStatementService.getlist(data);
		
		data.remove("isAdmin");			// 관리자 여부 제거
		
		String jsonArrayList 	= null;
		
		jsonArrayList = JsonUtils.getJsonStringFromList(list); 	// JSONARRAY 변환
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayList : " + jsonArrayList);
		LOG.debug("# totalAmount : " + totalAmount);
		LOG.debug("#################################################################################");
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("totalAmount", totalAmount);
		
		return mv;
	}
	
	/**
	 * 월별 경비 통계 상세 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getMonthlyExpenseView.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getView(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getAppView.exp");
		}
		Map<String, Object> data = new HashMap<>();
		
		String regDate = (String)params.get("regDate");				// 시작 날짜
		String MEMBER_NO = (String)params.get("MEMBER_NO");			// 사원 번호
		LOG.debug("#####################################################################################");
		LOG.debug("# SEARCH DATA ");
		LOG.debug("# regDate 		: " + regDate);
		LOG.debug("#####################################################################################");
		
		String REG_START_DATE 	= ""; // 그달의 시작일 
		String REG_END_DATE		= ""; // 그달의 종료일
		
		REG_START_DATE = regDate + "01";
		// 그달의 마지막 일 구하기
		int lastDate = commonUtil.LastDateInMonth(regDate);
		// 그해의 첫 날
		REG_END_DATE = regDate + String.valueOf(lastDate);
		
		data.put("REG_START_DATE", REG_START_DATE);		// 그달의 시작일
		data.put("REG_END_DATE", REG_END_DATE);			// 그달의 종료일
		data.put("MEMBER_NO", MEMBER_NO);				// 사원 번호
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 비어있는 경우,
		
		
		// 경비 총금액
		String totalAmount = expenseStatementService.getIndiTotalAmount(data);
		
		// 목록 조회
		List<Map<String, Object>> list = expenseStatementService.getView(data);
		
		String jsonArrayList 	= null;
		
		jsonArrayList = JsonUtils.getJsonStringFromList(list); 	// JSONARRAY 변환
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayList : " + jsonArrayList);
		LOG.debug("# totalAmount : " + totalAmount);
		LOG.debug("#################################################################################");
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("totalAmount", totalAmount);
		
		return mv;
	}
	
	/**
	 * 월별 경비 통계 리스트 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getCommAndTransExpenseList.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getCommAndTransExpenseList(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getCommAndTransExpenseList.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		Map<String, Object> data = new HashMap<>();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		String year = (String)params.get("year");				// 시작 날짜

		LOG.debug("#####################################################################################");
		LOG.debug("# SEARCH DATA ");
		LOG.debug("# year 		: " + year);
		LOG.debug("#####################################################################################");
		
		data.put("YEAR", year);		// 선택 년도
		
		HttpSession session = request.getSession();
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부

		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		
		// 세션 VO에 세션 값 저장
		data.put("isAdmin", isAdmin);	// 관리자 여부
		data.put("MEMBER_NO", mno);		// 사원번호
		
		// 통신비 목록 조회
		List<Map<String, Object>> commList = expenseStatementService.getCommExpenseList(data);
		// 교통비 조회
		List<Map<String, Object>> transList = null;
		
		try {
			transList = expenseStatementService.getTransExpenseList(data);
			
			LOG.debug("#### transList : " + transList);
			
		} catch (ParseException e) {
			LOG.debug("Exception : " + e.getMessage());
		}
		
		data.remove("isAdmin");			// 관리자 여부 제거
		data.remove("MEMBER_NO");		// 사원번호
		
		// Month KEY Array
		String[] monthArray = {"Jan", "Fab", "Mar", "Apr", "May", "June", "July","Aug", "Sept", "Oct", "Nov", "Dec"};
		
		// 통신비 & 교통비 합계 
		
		for(int i = 0; i < commList.size(); i++) {
			int commTotalAmount = 0;
			int transTotalAmount = 0;
			for(int j = 0; j < monthArray.length; j++) {
				commTotalAmount += Integer.parseInt((String) commList.get(i).get(monthArray[j]));
				commList.get(i).put("totalAmount", commTotalAmount);
			}
			for(int j = 0; j < monthArray.length; j++) {
				transTotalAmount += (Long)transList.get(i).get(monthArray[j]);
				transList.get(i).put("totalAmount", transTotalAmount);
			}
			
			commList.get(i).put("commAndTransTotalAmount", transTotalAmount+commTotalAmount);
		}
		
		String jsonArraycommList 	= null;
		String jsonArraytransList	= null;
		
		jsonArraycommList = JsonUtils.getJsonStringFromList(commList); 	// JSONARRAY 변환
		jsonArraytransList = JsonUtils.getJsonStringFromList(transList); 	// JSONARRAY 변환
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArraycommList : " + jsonArraycommList);
		LOG.debug("# jsonArraytransList : " + jsonArraytransList);
		LOG.debug("#################################################################################");
		
		mv.addObject("commList", jsonArraycommList);
		mv.addObject("transList", jsonArraytransList);
		mv.addObject("totalRow", "");
		return mv;
	}
}
