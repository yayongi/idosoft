package kr.co.idosoft.intranet.expense.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import kr.co.idosoft.intranet.expense.model.service.AnnalListServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;
/**
 * 
 * @author 유기환
 * @since 2020.03.24
 * @content AnnualList Controller
 */
@Controller
public class AnnualListController {
	private static final Logger LOG = LoggerFactory.getLogger(AnnualListController.class);
	
	@Resource
	AnnalListServiceImpl annalListService;
	
	/**
	 * 경비 등록
	 * @param model
	 * @param mutipartRequest
	 * @param request
	 * @param params
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
		
		//수정 처리할 때, 이용
		//String preFileName = mutipartRequest.getParameter("prefilename"); // 기종 파일 명
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
			/*
			 * if(!"".equals(preFileName) || preFileName != null) {
			 * deleteFile(preFileName,path); }
			 */
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
		String FIR_SANCTENER_MEMBER_NO = annalListService.getFirSanCternerMno();
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
}
