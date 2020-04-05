package kr.co.idosoft.intranet.expense.controller;

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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.idosoft.common.util.CollectionsUtil;
import kr.co.idosoft.common.util.JsonUtils;
import kr.co.idosoft.common.util.PageInfo;
import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.expense.model.service.ApprovalListServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;

/**
 * 
 * @author 유기환
 * @since 2020.03.28
 * @content AnnualList Controller
 */
@Controller
public class ApprovalListController {
	private static final Logger LOG = LoggerFactory.getLogger(ApprovalListController.class);
	
	private static final String EXPENSE_TYPE = "CD0002"; // 경비유형 
	private static final String PAYMENT_TYPE = "CD0003"; // 결재유형
	
	@Resource
	ApprovalListServiceImpl approvalListService;
	
	/**
	 * 경비결재목록 리스트 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getApprovalList.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getList(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getApprovalList.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		Map<String, Object> data = new HashMap<>();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		String name 			= (String)params.get("name");					// 이름
		String expenseType 		= (String)params.get("expenseType");			// 경비 유형
		String payStDt 			= (String)params.get("payStDt");				// 시작 날짜
		String payEdDt 			= (String)params.get("payEdDt");				// 종료 날짜
		String status 			= (String)params.get("status");					// 결재 상태
		String memo 			= (String)params.get("memo");					// 내용
		// 리스트 추가 요청시, true
		String isAddList 		= (String) params.getOrDefault("isAddList", "false");
		
		LOG.debug("#####################################################################################");
		LOG.debug("# SEARCH DATA ");
		LOG.debug("# name 			: " + name);
		LOG.debug("# expenseType 	: " + expenseType);
		LOG.debug("# payStDt 		: " + payStDt);
		LOG.debug("# payEdDt 		: " + payEdDt);
		LOG.debug("# status 		: " + status);
		LOG.debug("# memo 			: " + memo);
		LOG.debug("#####################################################################################");
		
		// -1 전체로 들어왔을  경우, null로 변환
		expenseType = !"-1".equals(expenseType) ? expenseType : null;
		status 		= !"-1".equals(status) ? status : null;
		
		// 그해의 첫 날
		payStDt = payStDt + "01";
		
		// 그달의 마지막 일 구하기
		int lastDate = commonUtil.LastDateInMonth(payEdDt);
		payEdDt = payEdDt + String.valueOf(lastDate);
		
		LOG.debug("# LastDateInMonth : " + lastDate);
		
		data.put("name", name);
		data.put("expenseType", expenseType);
		data.put("payStDt", payStDt);
		data.put("payEdDt", payEdDt);
		data.put("status", status);
		data.put("memo", memo);
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부

		data.put("MEMBER_NO", mno);		// 사원번호
		data.put("isAdmin", isAdmin);	// 관리자 여부
		
		Integer temp 		= Integer.parseInt((String) params.get("currentPage"));
		int currentPage 	= temp == null ? 1 : temp;					// 현재 페이지 (default : 1)
		temp 				= Integer.parseInt((String) params.get("limit"));
		int limit			= temp == null ? 10 : temp;; 				// 페이지 당 목록 개수
		int listCount 		= approvalListService.getlistCount(data);		// 전체 목록 개수
		
		// 목록이 없는 경우,
		if(listCount == 0) {
			mv.addObject("isNoN", "true");
			return mv;
		}
		
		// 페이징 유지시, limit 검색조건을 현재페이지 * 제한페이지로 해서 현재페이지의 데이터를 요청한다.
		int tempLimit = 0;
		if("true".equals(isAddList)) {
			tempLimit = currentPage * limit; 
		} else {
			tempLimit = limit;
		}
		
		int maxPage 		= (int)((double)listCount / limit + 0.9);					// 최대 페이지
		int startPage 		= ((int)((double)currentPage / limit + 0.9) - 1)*tempLimit + 1;	// 시작 페이지
		int endPage 		= (int) startPage + limit -1;								// 종료 페이지
		
		if(maxPage<endPage){
			endPage = maxPage;
		}
		
		/* 검색 및 페이징 처리 유지를 위해 추가 start */
		int tempCurrentPage = 0;
		int tempMaxPage 	= 0;
		int tempStartPage	= 0;
		int tempEndPage		= 0;

		if(tempLimit != limit) {
			tempCurrentPage	= 1;
			tempMaxPage 	= (int)((double)listCount / tempLimit + 0.9);
			tempStartPage	= 1;
			tempEndPage		= (int) tempStartPage + tempLimit -1;
			
			if(tempMaxPage<tempEndPage){
				tempEndPage = tempMaxPage;
			}
			
		} else {
			tempCurrentPage	= currentPage;
			tempMaxPage		= maxPage;
			tempStartPage	= startPage;
			tempEndPage		= endPage;
		}
		
		/* 검색 및 페이징 처리 유지를 위해 추가 end */
		LOG.debug("#################################################################################");
		LOG.debug("# PAGE - INFO ");
		LOG.debug("# currentPage 	: " + tempCurrentPage);
		LOG.debug("# limit 			: " + tempLimit);
		LOG.debug("# listCount 		: " + listCount);
		LOG.debug("# startPage 		: " + tempStartPage);
		LOG.debug("# endPage 		: " + tempEndPage);
		LOG.debug("#################################################################################");
		
		PageInfo pi = new PageInfo(); // 페이지 정보
		
		pi.setCurrentPage(tempCurrentPage);
		pi.setEndPage(tempEndPage);
		pi.setLimit(tempLimit);
		pi.setListCount(listCount);
		pi.setMaxPage(tempMaxPage);
		pi.setStartPage(tempStartPage);
		
		data.putAll(CollectionsUtil.beanToMap(pi));
		
		LOG.debug("data : " + data);
		
		// 경비 총금액
		//String totalAmount = approvalListService.getTotalAmount(data);
		
		// 경비 총금액
		String totalProgAmount 		= approvalListService.getTotalProgAmount(data);
		String totalFirAmount 		= approvalListService.getTotalFirAppAmount(data);	
		String totalCompAmount 		= approvalListService.getTotalCompAmount(data);
		String totalReturnAmount	= approvalListService.getTotalReturnAmount(data);

		// 목록 조회
		List<Map<String, Object>> list = approvalListService.getlist(data);
		
		data.remove("MEMBER_NO");		// 사원번호 제거
		data.remove("isAdmin");			// 관리자 여부 제거
		
		data.put("limit", limit);				// limit 초기화
		data.put("currentPage", currentPage);	// maxPage 초기화
		data.put("tempMaxPage", tempMaxPage);	// maxPage 초기화
		data.put("startPage", startPage);		// startPage 초기화
		data.put("endPage", endPage);			// endPage 초기화
		
		ObjectMapper mapper = new ObjectMapper();
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		try {
			jsonArrayList = JsonUtils.getJsonStringFromList(list); 	// JSONARRAY 변환
			jsonObjectData = mapper.writeValueAsString(data); 		// JSONOBJECT 변환
		} catch (JsonProcessingException e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
		}
		
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayList : " + jsonArrayList);
		LOG.debug("# jsonObjectData : " + jsonObjectData);
		LOG.debug("# totalProgAmount : " + totalProgAmount);
		LOG.debug("# totalFirAmount : " + totalFirAmount);
		LOG.debug("# totalCompAmount : " + totalCompAmount);
		LOG.debug("# totalReturnAmount : " + totalReturnAmount);
		LOG.debug("# isAdmin : " + isAdmin);
		LOG.debug("#################################################################################");
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("result", jsonObjectData);
		mv.addObject("totalProgAmount", totalProgAmount);
		mv.addObject("totalFirAmount", totalFirAmount);
		mv.addObject("totalCompAmount", totalCompAmount);
		mv.addObject("totalReturnAmount", totalReturnAmount);
		mv.addObject("isAdmin", isAdmin);
		
		return mv;
	}
	
	/**
	 * 경비결재 처리 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/processApproval.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView processApproval(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/updateProcessApproval.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		Map<String, Object> data = new HashMap<>();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,

		String isRequest	= (String)params.get("isRequest");	// 조건(1차결재 FIR_APP, 2차결재 APP, 반려 REG)
		String expenseNo	= (String)params.get("expenseNo");	// 경비 번호
		String rejReason	= (String)params.get("rejReason");	// 반려 사유
		
		data.put("isRequest", isRequest);
		data.put("EXPENS_NO", expenseNo);
		data.put("RETURN_CN", rejReason);
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
		
		data.put("MEMBER_NO", mno);		// 사원번호
		data.put("isAdmin", isAdmin);	// 관리자 여부
		
		if(!approvalListService.updateApproval(data)) {
			mv.addObject("isError", "true");
			mv.addObject("errorMessage", "해당 직원은 결재 권한이 없습니다.");
		}
		
		data.clear();
		
		return mv;
	}
	
	/**
	 * 경비결재 처리 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/multiplexApproval.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView multiplexApproval(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/multiplexApproval.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		Map<String, Object> data = new HashMap<>();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,

		ArrayList<Integer> firAppMembers 	= (ArrayList<Integer>) params.get("firAppMembers"); 
		ArrayList<Integer> appMembers 		= (ArrayList<Integer>) params.get("appMembers");
		
		LOG.debug("# firAppMembers 	: " + firAppMembers.size());
		LOG.debug("# appMembers 	: " + appMembers.size());
		
		data.put("firAppMembers", firAppMembers.size() > 0 ? firAppMembers : null); 
		data.put("appMembers", appMembers.size() > 0 ? appMembers : null);
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
		
		data.put("MEMBER_NO", mno);		// 사원번호
		data.put("isAdmin", isAdmin);	// 관리자 여부
		
		if(!approvalListService.multiplexApproval(data)) {
			mv.addObject("isError", "true");
			mv.addObject("errorMessage", "해당 직원은 결재 권한이 없습니다.");
		}
		
		data.clear();
		
		return mv;
	}
	
	/**
	 * 경비 목록
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getAppView.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getView(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getAppView.exp");
		}
		
		String expense_no = (String)params.get("expense_no");
		String screenType = (String)params.get("screenType");
		
		LOG.debug("###################################################################################");
		LOG.debug("# expense_no : " + expense_no);
		LOG.debug("###################################################################################");
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");				// 비어있는 경우,
		mv.addObject("contextPath", request.getSession().getServletContext().getContextPath() + "/resources/expense/");
		Map<String, Object> data = new HashMap<>();
		
		data.put("TYPE", EXPENSE_TYPE); // 경비 유형
		List<Map<String, Object>> exPenseTypeList = approvalListService.getCode(data);
		
		data.put("TYPE", PAYMENT_TYPE);	// 결재 유형 
		List<Map<String, Object>> payTypeList = approvalListService.getCode(data);
		
		data.remove("TYPE"); // TYPE 값을 지워준다.
		
		data.put("EXPENS_NO", expense_no);
		
		Map<String, Object> view = approvalListService.getView(data);
		
		ObjectMapper mapper = new ObjectMapper();

		String jsonArrayexPenseTypeList 	= null;
		String jsonArraypayTypeList 		= null;
		
		jsonArrayexPenseTypeList 	= JsonUtils.getJsonStringFromList(exPenseTypeList); 	// JSONARRAY 변환
		jsonArraypayTypeList 		= JsonUtils.getJsonStringFromList(payTypeList); 		// JSONARRAY 변환
		
		mv.addObject("expenseTypeList", jsonArrayexPenseTypeList);
		mv.addObject("payTypeList", jsonArraypayTypeList);
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayexPenseTypeList : " + jsonArrayexPenseTypeList);
		LOG.debug("# jsonArraypayTypeList : 	" + jsonArraypayTypeList);
		
		HttpSession session = request.getSession();
		
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				// 관리자 여부
		mv.addObject("isAdmin", isAdmin);
		
		if(!"new".equals(screenType)) { // 등록화면이 아닐 경우,
			
			if(view == null) {
				mv.addObject("isNoN", "true");				// 비어있는 경우,
				return mv;
			}
			
			String jsonViewObject = null;
			try {
				jsonViewObject = mapper.writeValueAsString(view); // JSONOBJECT 변환
				LOG.debug("# jsonViewObject : 			" + jsonViewObject);
				mv.addObject("result", jsonViewObject);
			} catch (JsonProcessingException e) {
				LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
			} 
		}
		LOG.debug("#################################################################################");
		
		return mv;
	}
}
