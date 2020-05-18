package kr.co.idosoft.intranet.expense.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.mustachejava.PragmaHandler;

import kr.co.idosoft.common.util.CollectionsUtil;
import kr.co.idosoft.common.util.JsonUtils;
import kr.co.idosoft.common.util.PageInfo;
import kr.co.idosoft.intranet.expense.model.service.AnnalListServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.common.util.commonUtil;
/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Controller
 */
@Controller
public class AnnualListController {
	private static final Logger LOG = LoggerFactory.getLogger(AnnualListController.class);
	
	private static final String EXPENSE_TYPE = "CD0002"; // 경비유형 
	private static final String PAYMENT_TYPE = "CD0003"; // 결재유형
	
	@Resource
	AnnalListServiceImpl annalListService;
	
	/**
	 * 경비관리 목록 
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getAnnaualList.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getList(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getAnnaualList.exp");
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
		// currentPage 1 초과하고 rows가 비어있는 경우,
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
		LOG.debug("# isAddList 		: " + isAddList);
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
		int listCount 		= annalListService.getlistCount(data);		// 전체 목록 개수
		
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
		LOG.debug("# limit 			: " + limit);
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
		String totalProgAmount 		= annalListService.getTotalProgAmount(data);
		String totalFirAmount 		= annalListService.getTotalFirAppAmount(data);	
		String totalCompAmount 		= annalListService.getTotalCompAmount(data);
		String totalReturnAmount	= annalListService.getTotalReturnAmount(data);
		// 목록 조회
		List<Map<String, Object>> list = annalListService.getlist(data);
		
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
		LOG.debug("#################################################################################");
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("result", jsonObjectData);
		mv.addObject("totalProgAmount", totalProgAmount);
		mv.addObject("totalFirAmount", totalFirAmount);
		mv.addObject("totalCompAmount", totalCompAmount);
		mv.addObject("totalReturnAmount", totalReturnAmount);
		return mv;
	}
	
	/**
	 * 경비 등록
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/resister.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView resisterExpense(MultipartHttpServletRequest mutipartRequest
										, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/") + "resources/expense/";
				
		if(LOG.isDebugEnabled()) {
			LOG.debug("/resister.exp // path : " + path);
		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");
		
		/* 파일업로드 처리 START */
		MultipartFile mf = mutipartRequest.getFile("file"); // jsp file name mapping
		
		// 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추가
		Date date = new Date();
		
		SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
		SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", Locale.KOREA);
		String day = dayformat.format(date);
		String hour = hourformat.format(date);
		String fileName = "expense_" + day + "_" + hour;         
		
		String originalName = mf.getOriginalFilename(); 					// 업로드하는 파일 name
		
		// 확장자 가져오기
		int pos = originalName.lastIndexOf( "." );
		String ext = originalName.substring( pos + 1 );
		
		String newFileName = fileName + "." + ext;
		
		LOG.debug("# newFileName : " + newFileName); 

		String uploadPath = path+newFileName; // 파일 업로드 경로 + 파일 이름
		LOG.debug("# uploadPath : " + uploadPath);
		
		File file = new File(uploadPath);

		try {
			if(!file.exists()) {
				file.mkdirs();
			}
			mf.transferTo(file); // 파일을 위에 지정 경로로 업로드
			
		} catch (IllegalStateException e) {
			LOG.debug(" IllegalStateException : " + e.getMessage());
			
			mv.addObject("isError", "true");
			mv.addObject("errMessage","File Upload Error");
			return mv;
		} catch (IOException e) {
			LOG.debug(" IOException : " + e.getMessage());
			
			mv.addObject("isError", "true");
			mv.addObject("errMessage","File Upload Error");
			return mv;
		}
		
		//DB 저장 path
		
		data.put("EXPENS_ATCHMNF_ID", uploadPath);
		/* 파일업로드 처리 EMD */
		
		HttpSession session = request.getSession();
		// 세션 VO에 세션 값 저장
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		String mno = sessionVo.getMEMBER_NO();						// 사원번호
		
		data.put("MEMBER_NO", mno);	// 사원번호
		
		String EXPENS_TY_CODE 	= mutipartRequest.getParameter("EXPENS_TY_CODE");	// 경비유형
		String USE_DATE 		= mutipartRequest.getParameter("USE_DATE");			// 결재금액
		String USE_AMOUNT 		= mutipartRequest.getParameter("USE_AMOUNT");		// 결재금액
		String USE_CN 			= mutipartRequest.getParameter("USE_CN");			// 결재내용
		
		LOG.debug("############################################################################");
		LOG.debug("# EXPENS_TY_CODE : " + EXPENS_TY_CODE);
		LOG.debug("# USE_DATE : " + USE_DATE);
		LOG.debug("# USE_AMOUNT : " + USE_AMOUNT);
		LOG.debug("# USE_CN : " + USE_CN);
		LOG.debug("############################################################################");
		
		data.put("EXPENS_TY_CODE", EXPENS_TY_CODE);				// 경비유형
		data.put("USE_DATE", USE_DATE);							// 결재금액
		data.put("USE_AMOUNT", Integer.parseInt(USE_AMOUNT));	// 결재금액
		data.put("USE_CN", USE_CN);								// 결재내용
		
		// 1차결재자 
		/*
		 * 1순위 : 소속 프로젝트의 PM 
		 * 2순위 : 소속 프로젝트가 없다면, 직원정보테이블에 등록된 1차 결재자
		 */ 
		String FIR_SANCTENER_MEMBER_NO = annalListService.getFirSanCternerMno(data);
		data.put("FIR_SANCTENER_MEMBER_NO", FIR_SANCTENER_MEMBER_NO);
		LOG.debug("FIR_SANCTENER_MEMBER_NO : " + FIR_SANCTENER_MEMBER_NO);
		
		// 현재 대표직책을 가진 사람을 2차결재자로 한다.
		String SANCTNER_MEMBER_NO = annalListService.getRepresentativeNo();
		data.put("SANCTNER_MEMBER_NO", SANCTNER_MEMBER_NO);
		LOG.debug("SANCTNER_MEMBER_NO : " + SANCTNER_MEMBER_NO);
		
		if(FIR_SANCTENER_MEMBER_NO == null || SANCTNER_MEMBER_NO == null) {
			mv.addObject("isError", "true");
			mv.addObject("errMessage","결재자 지정 실패 다시시도하세요.");
			return mv;
		}
		
		if(!annalListService.insertExpense(data)) {
			mv.addObject("isError", "false");
			mv.addObject("errMessage","결재등록 실패 다시시도하세요.");
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
	
	@RequestMapping(value="/getAnnView.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getView(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getView.exp");
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
		mv.addObject("contextPath", request.getSession().getServletContext().getContextPath() + "/resources/expense/");
		
		Map<String, Object> data = new HashMap<>();
		
		data.put("TYPE", EXPENSE_TYPE); // 경비 유형
		List<Map<String, Object>> exPenseTypeList = annalListService.getCode(data);
		
		data.put("TYPE", PAYMENT_TYPE);	// 결재 유형 
		List<Map<String, Object>> payTypeList = annalListService.getCode(data);
		
		data.put("EXPENS_NO", expense_no);
		
		Map<String, Object> view = annalListService.getView(data);
		
		ObjectMapper mapper = new ObjectMapper();

		String jsonArrayexPenseTypeList 	= null;
		String jsonArraypayTypeList 		= null;
		
		jsonArrayexPenseTypeList 	= JsonUtils.getJsonStringFromList(exPenseTypeList); 	// JSONARRAY 변환
		jsonArraypayTypeList 		= JsonUtils.getJsonStringFromList(payTypeList); 		// JSONARRAY 변환
		
		mv.addObject("expenseTypeList", jsonArrayexPenseTypeList);
		mv.addObject("payTypeList", jsonArraypayTypeList);
		
		HttpSession session = request.getSession();
		
		String isAdmin = (String) session.getAttribute("IS_ADMIN");				// 관리자 여부
		mv.addObject("isAdmin", isAdmin);
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayexPenseTypeList : " + jsonArrayexPenseTypeList);
		LOG.debug("# jsonArraypayTypeList : 	" + jsonArraypayTypeList);
		LOG.debug("# isAdmin : 	" + isAdmin);
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
	
	/**
	 * 코드 조회
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/getCode.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getCode(HttpServletRequest request, @RequestBody Map<String, Object> params) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getCode.exp");
		}
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		
		Map<String, Object> data = new HashMap<>();
		
		data.put("TYPE", EXPENSE_TYPE); // 경비 유형
		List<Map<String, Object>> exPenseTypeList = annalListService.getCode(data);
		
		data.put("TYPE", PAYMENT_TYPE);	// 결재 유형 
		List<Map<String, Object>> payTypeList = annalListService.getCode(data);
		
		String jsonArrayexPenseTypeList 	= null;
		String jsonArraypayTypeList 		= null;
		
		jsonArrayexPenseTypeList 	= JsonUtils.getJsonStringFromList(exPenseTypeList); 	// JSONARRAY 변환
		jsonArraypayTypeList 		= JsonUtils.getJsonStringFromList(payTypeList); 		// JSONARRAY 변환
		
		LOG.debug("#################################################################################");
		LOG.debug("# RETURN JSON ");
		LOG.debug("# jsonArrayexPenseTypeList : " + jsonArrayexPenseTypeList);
		LOG.debug("# jsonArraypayTypeList : 	" + jsonArraypayTypeList);
		LOG.debug("#################################################################################");
		
		mv.addObject("expenseTypeList", jsonArrayexPenseTypeList);
		mv.addObject("payTypeList", jsonArraypayTypeList);
		
		return mv;
	}
	
	/**
	 * 경비 수정
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/update.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView updateExpense(MultipartHttpServletRequest mutipartRequest
										, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/") + "resources/expense/";
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/update.exp // path : " + path);
		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");
		
		MultipartFile mf = mutipartRequest.getFile("file"); // jsp file name mapping
		
		//LOG.debug("# MultipartFile isEmpty : " + mf.isEmpty());
		
		if(!(mf == null)) {
			/* 파일업로드 처리 START */
			// 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추가
			Date date = new Date();
			
			SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
			SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", Locale.KOREA);
			String day = dayformat.format(date);
			String hour = hourformat.format(date);
			String fileName = "expense_" + day + "_" + hour;         
			
			//수정 처리할 때, 이용
			String preFileName = mutipartRequest.getParameter("prefilename"); // 기종 파일 명
			String originalName = mf.getOriginalFilename(); 					// 업로드하는 파일 name
			
			// 확장자 가져오기
			int pos = originalName.lastIndexOf( "." );
			String ext = originalName.substring( pos + 1 );
			
			String newFileName = fileName + "." + ext;
			
			LOG.debug("# newFileName : " + newFileName); 

			String uploadPath = path+newFileName; // 파일 업로드 경로 + 파일 이름
			LOG.debug("# uploadPath : " + uploadPath);
			
			File file = new File(uploadPath);

			try {
				if(!file.exists()) {
					file.mkdirs();
				}
				mf.transferTo(file); // 파일을 위에 지정 경로로 업로드
				
				//수정 처리할 때 이용
				//기존 파일 삭제 로직
				
				if(!"".equals(preFileName) || preFileName != null) {
					deleteFile(preFileName); 
				}
				
			} catch (IllegalStateException e) {
				LOG.debug(" IllegalStateException : " + e.getMessage());
				
				mv.addObject("isError", "true");
				mv.addObject("errMessage","File Upload Error");
				return mv;
			} catch (IOException e) {
				LOG.debug(" IOException : " + e.getMessage());
				
				mv.addObject("isError", "true");
				mv.addObject("errMessage","File Upload Error");
				return mv;
			}
			
			data.put("EXPENS_ATCHMNF_ID", uploadPath);
			/* 파일업로드 처리 EMD */
		}
		
		
		HttpSession session = request.getSession();
		// 세션 VO에 세션 값 저장
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		String mno = sessionVo.getMEMBER_NO();						// 사원번호
		
		data.put("MEMBER_NO", mno);	// 사원번호
		String EXPENS_NO		= mutipartRequest.getParameter("EXPENS_NO");		// 경비번호
		String EXPENS_TY_CODE 	= mutipartRequest.getParameter("EXPENS_TY_CODE");	// 경비유형
		String USE_DATE 		= mutipartRequest.getParameter("USE_DATE");			// 결제날짜
		String USE_AMOUNT 		= mutipartRequest.getParameter("USE_AMOUNT");		// 결제금액
		String USE_CN 			= mutipartRequest.getParameter("USE_CN");			// 결제내용
		
		LOG.debug("############################################################################");
		LOG.debug("# EXPENS_NO : " + EXPENS_NO);
		LOG.debug("# EXPENS_TY_CODE : " + EXPENS_TY_CODE);
		LOG.debug("# USE_DATE : " + USE_DATE);
		LOG.debug("# USE_AMOUNT : " + USE_AMOUNT);
		LOG.debug("# USE_CN : " + USE_CN);
		LOG.debug("############################################################################");
		
		data.put("EXPENS_NO", EXPENS_NO);					// 경비유형
		data.put("EXPENS_TY_CODE", EXPENS_TY_CODE);				// 경비유형
		data.put("USE_DATE", USE_DATE);							// 결제금액
		data.put("USE_AMOUNT", Integer.parseInt(USE_AMOUNT));	// 결제금액
		data.put("USE_CN", USE_CN);								// 결제내용
		
		if(!annalListService.updateExpense(data)) {
			mv.addObject("isError", "false");
			mv.addObject("errMessage","결제수정 실패 다시시도하세요.");
		}
		
		data.clear();
		
		return mv;
	}
	
	/**
	 * 경비 삭제
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/delete.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView deleteExpense(MultipartHttpServletRequest mutipartRequest
										, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/") + "resources/expense/";
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/delete.exp // path : " + path);
		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");
		
		HttpSession session = request.getSession();
		// 세션 VO에 세션 값 저장
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		String mno = sessionVo.getMEMBER_NO();						// 사원번호
		
		data.put("MEMBER_NO", mno);	// 사원번호
		String EXPENS_NO		= mutipartRequest.getParameter("EXPENS_NO");		// 경비번호
		
		LOG.debug("############################################################################");
		LOG.debug("# EXPENS_NO : " + EXPENS_NO);
		
		
		LOG.debug("############################################################################");
		
		data.put("EXPENS_NO", EXPENS_NO);					// 경비유형
		if(EXPENS_NO != null) {
			/* 파일삭제 처리 START - if문 안에서 실행하려고 햇는데 안됨.. 선처리 */
			
			String preFileName = mutipartRequest.getParameter("prefilename"); // 기종 파일 명
			
			LOG.debug("# preFileName : " + preFileName);
			
			if(!"".equals(preFileName) || preFileName != null) {
				deleteFile(preFileName); 
			}
			/* 파일삭제 처리 EMD */
		}
		
		if(!annalListService.deleteExpense(data)) {
			
			mv.addObject("isError", "false");
			mv.addObject("errMessage","결제삭제 실패 다시시도하세요.");
		}
		
		data.clear();
		
		return mv;
	}
	
	/**
	 * 경비 진행
	 * @param mutipartRequest
	 * @param request
	 * @return ModelAndView
	 */
	
	@RequestMapping(value="/Proceed.exp", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView Proceed(MultipartHttpServletRequest mutipartRequest
										, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/") + "resources/expense/";
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/Proceed.exp // path : " + path);
		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");
		
		MultipartFile mf = mutipartRequest.getFile("file"); // jsp file name mapping
		
		if(!(mf == null)) {
			/* 파일업로드 처리 START */
			// 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추가
			Date date = new Date();
			
			SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
			SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", Locale.KOREA);
			String day = dayformat.format(date);
			String hour = hourformat.format(date);
			String fileName = "expense_" + day + "_" + hour;         
			
			//수정 처리할 때, 이용
			String preFileName = mutipartRequest.getParameter("prefilename"); // 기종 파일 명
			String originalName = mf.getOriginalFilename(); 					// 업로드하는 파일 name
			
			// 확장자 가져오기
			int pos = originalName.lastIndexOf( "." );
			String ext = originalName.substring( pos + 1 );
			
			String newFileName = fileName + "." + ext;
			
			LOG.debug("# newFileName : " + newFileName); 

			String uploadPath = path+newFileName; // 파일 업로드 경로 + 파일 이름
			LOG.debug("# uploadPath : " + uploadPath);
			
			File file = new File(uploadPath);

			try {
				if(!file.exists()) {
					file.mkdirs();
				}
				mf.transferTo(file); // 파일을 위에 지정 경로로 업로드
				
				//수정 처리할 때 이용
				//기존 파일 삭제 로직
				
				if(!"".equals(preFileName) || preFileName != null) {
					deleteFile(preFileName); 
				}
				
			} catch (IllegalStateException e) {
				LOG.debug(" IllegalStateException : " + e.getMessage());
				
				mv.addObject("isError", "true");
				mv.addObject("errMessage","File Upload Error");
				return mv;
			} catch (IOException e) {
				LOG.debug(" IOException : " + e.getMessage());
				
				mv.addObject("isError", "true");
				mv.addObject("errMessage","File Upload Error");
				return mv;
			}
			
			data.put("EXPENS_ATCHMNF_ID", uploadPath);
			/* 파일업로드 처리 EMD */
		}
		
		
		HttpSession session = request.getSession();
		// 세션 VO에 세션 값 저장
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		String mno = sessionVo.getMEMBER_NO();						// 사원번호
		
		data.put("MEMBER_NO", mno);	// 사원번호
		String EXPENS_NO		= mutipartRequest.getParameter("EXPENS_NO");		// 경비번호
		String EXPENS_TY_CODE 	= mutipartRequest.getParameter("EXPENS_TY_CODE");	// 경비유형
		String USE_DATE 		= mutipartRequest.getParameter("USE_DATE");			// 결제날짜
		String USE_AMOUNT 		= mutipartRequest.getParameter("USE_AMOUNT");		// 결제금액
		String USE_CN 			= mutipartRequest.getParameter("USE_CN");			// 결제내용
		
		LOG.debug("############################################################################");
		LOG.debug("# EXPENS_NO : " + EXPENS_NO);
		LOG.debug("# EXPENS_TY_CODE : " + EXPENS_TY_CODE);
		LOG.debug("# USE_DATE : " + USE_DATE);
		LOG.debug("# USE_AMOUNT : " + USE_AMOUNT);
		LOG.debug("# USE_CN : " + USE_CN);
		LOG.debug("############################################################################");
		
		data.put("EXPENS_NO", EXPENS_NO);					// 경비유형
		data.put("EXPENS_TY_CODE", EXPENS_TY_CODE);				// 경비유형
		data.put("USE_DATE", USE_DATE);							// 결제금액
		data.put("USE_AMOUNT", Integer.parseInt(USE_AMOUNT));	// 결제금액
		data.put("USE_CN", USE_CN);								// 결제내용
		
		if(!annalListService.Proceed(data)) {
			mv.addObject("isError", "false");
			mv.addObject("errMessage","결제수정 실패 다시시도하세요.");
		}
		
		data.clear();
		
		return mv;
	}
	// 파일 삭제 메소드
	public static void deleteFile(String filePath) {

		File file = new File(filePath); 
		if( file.exists() ){ 
			if(file.delete()){ 
				System.out.println("파일삭제 성공"); 
			}else{ 
				System.out.println("파일삭제 실패"); 
			} 
		}else{ 
			System.out.println("파일이 존재하지 않습니다."); 
		} 

	}
	
}	
