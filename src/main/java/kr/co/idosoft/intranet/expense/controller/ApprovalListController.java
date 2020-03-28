package kr.co.idosoft.intranet.expense.controller;

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
	
	@Resource
	ApprovalListServiceImpl approvalListService;
	
	/**
	 * 경비관리 목록 
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
		
		int maxPage 		= (int)((double)listCount / limit + 0.9);					// 최대 페이지
		int startPage 		= ((int)((double)currentPage / limit + 0.9) - 1)*limit + 1;	// 시작 페이지
		int endPage 		= (int) startPage + limit -1;								// 종료 페이지
		
		if(maxPage<endPage){
			endPage = maxPage;
		}
		LOG.debug("#################################################################################");
		LOG.debug("# PAGE - INFO ");
		LOG.debug("# currentPage 	: " + currentPage);
		LOG.debug("# limit 			: " + limit);
		LOG.debug("# listCount 		: " + listCount);
		LOG.debug("# startPage 		: " + startPage);
		LOG.debug("# endPage 		: " + endPage);
		LOG.debug("#################################################################################");
		
		PageInfo pi = new PageInfo(); // 페이지 정보
		
		pi.setCurrentPage(currentPage);
		pi.setEndPage(endPage);
		pi.setLimit(limit);
		pi.setListCount(listCount);
		pi.setMaxPage(maxPage);
		pi.setStartPage(startPage);
		
		data.putAll(CollectionsUtil.beanToMap(pi));
		
		LOG.debug("data : " + data);
		
		// 경비 총금액
		String totalAmount = approvalListService.getTotalAmount(data);
		// 목록 조회
		List<Map<String, Object>> list = approvalListService.getlist(data);
		
		data.remove("MEMBER_NO");		// 사원번호 제거
		data.remove("isAdmin");			// 관리자 여부 제거
		
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
		LOG.debug("# totalAmount : " + totalAmount);
		LOG.debug("#################################################################################");
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("result", jsonObjectData);
		mv.addObject("totalAmount", totalAmount);
		
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
		
		data.put("isRequest", isRequest);
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		
		// 세션 VO에 세션 값 저장
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				//관리자 여부
		
		data.put("MEMBER_NO", mno);		// 사원번호
		data.put("isAdmin", isAdmin);	// 관리자 여부
		
		if(!approvalListService.updateApproval(data)) {
			mv.addObject("isError", "ture");
			mv.addObject("errorMessage", "해당 직원은 결재 권한이 없습니다.");
		}
		
		data.clear();
		
		return mv;
	}
}
