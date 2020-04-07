package kr.co.idosoft.intranet.common.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.common.model.service.ExcelServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.util.fileController;

/**
 * 
 * @author �쑀湲고솚
 * @since 2020.03.16
 * @content Excel
 */
@Controller
public class ExcelController {
	
	@Autowired
	fileController fileController;
	
	@Resource
	ExcelServiceImpl excelService;
	
	private static final Logger LOG = LoggerFactory.getLogger(ExcelController.class);
	
	@RequestMapping(value = "/downloadExcelFile", method = RequestMethod.POST)
	@ResponseBody
	public void downloadExcelFile(@RequestBody Map<String, Object> params,
									HttpServletResponse response,
									HttpServletRequest request){ //JSON Object	
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/downloadExcelFile");
		}
		
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("jsonView"); 

		String fileName 				= (String)params.get("fileName"); // �뿊�� �씠由�
		String fileCode 				= (String)params.get("fileCode"); // �뿊�� 肄붾뱶
		
		Map<String, Object> searchData 	= (Map<String, Object>)params.getOrDefault("searchData", null);
		
		// 寃뱀튂�뒗 �뙆�씪 �씠由� 以묐났�쓣 �뵾�븯湲� �쐞�빐 �떆媛꾩쓣 �씠�슜�빐�꽌 �뙆�씪 �씠由꾩뿉 異붽�
		Date date = new Date();
		
		SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
		SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", Locale.KOREA);
		String day = dayformat.format(date);
		String hour = hourformat.format(date);
		
		fileName = fileName + "_" + day + "_" + hour + ".xls";  
		
		LOG.debug("#############################################################################");
		LOG.debug("# fileName : " + fileName);
		LOG.debug("# fileCode : " + fileCode);
		LOG.debug("# searchData : " + searchData);
		LOG.debug("#############################################################################");
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		data.put("FILE_CODE", fileCode);
		
		if(searchData != null) {
			// EXCEL0001 �썡蹂� 寃쎈퉬 �넻怨� - 媛쒖씤
			// EXCEL0002 �썡蹂� 寃쎈퉬 �넻怨� - �쟾泥�
			// EXCEL0003 寃곗옱 愿�由�
			
			if("EXCEL0001".equals(fileCode) || "EXCEL0002".equals(fileCode)) {  
				String regDate = (String) searchData.get("regDate");
				
				String REG_START_DATE 	= ""; // 洹몃떖�쓽 �떆�옉�씪 
				String REG_END_DATE		= ""; // 洹몃떖�쓽 醫낅즺�씪
				
				REG_START_DATE = regDate + "01";
				// 洹몃떖�쓽 留덉�留� �씪 援ы븯湲�
				int lastDate = commonUtil.LastDateInMonth(regDate);
				// 洹명빐�쓽 泥� �궇
				REG_END_DATE = regDate + String.valueOf(lastDate);
				
				searchData.put("REG_START_DATE", REG_START_DATE);		// 洹몃떖�쓽 �떆�옉�씪
				searchData.put("REG_END_DATE", REG_END_DATE);			// 洹몃떖�쓽 醫낅즺�씪
				
			} else if("EXCEL0003".equals(fileCode) || "EXCEL0004".equals(fileCode)) {
				
				String expenseType 		= (String)searchData.get("expenseType");			// 寃쎈퉬 �쑀�삎
				String payStDt 			= (String)searchData.get("payStDt");				// �떆�옉 �궇吏�
				String payEdDt 			= (String)searchData.get("payEdDt");				// 醫낅즺 �궇吏�
				String status 			= (String)searchData.get("status");					// 寃곗옱 �긽�깭
				// currentPage 1 珥덇낵�븯怨� rows媛� 鍮꾩뼱�엳�뒗 寃쎌슦,
				
				LOG.debug("#####################################################################################");
				LOG.debug("# SEARCH DATA ");
				LOG.debug("# expenseType 	: " + expenseType);
				LOG.debug("# payStDt 		: " + payStDt);
				LOG.debug("# payEdDt 		: " + payEdDt);
				LOG.debug("# status 		: " + status);
				LOG.debug("#####################################################################################");
			
				// -1 �쟾泥대줈 �뱾�뼱�솕�쓣  寃쎌슦, null濡� 蹂��솚
				expenseType = !"-1".equals(expenseType) ? expenseType : null;
				status 		= !"-1".equals(status) ? status : null;
				
				// 洹명빐�쓽 泥� �궇
				payStDt = payStDt + "01";
				
				// 洹몃떖�쓽 留덉�留� �씪 援ы븯湲�
				int lastDate = commonUtil.LastDateInMonth(payEdDt);
				payEdDt = payEdDt + String.valueOf(lastDate);
				
				LOG.debug("# LastDateInMonth : " + lastDate);
				
				searchData.put("expenseType", expenseType);
				searchData.put("payStDt", payStDt);
				searchData.put("payEdDt", payEdDt);
				searchData.put("status", status);
				
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// �꽭�뀡 �젙蹂�
				String mno = sessionVo.getMEMBER_NO();									// 濡쒓렇�씤 �쉶�썝踰덊샇
				
				// �꽭�뀡 VO�뿉 �꽭�뀡 媛� ���옣
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//愿�由ъ옄 �뿬遺�

				searchData.put("MEMBER_NO", mno);		// �궗�썝踰덊샇
				searchData.put("isAdmin", isAdmin);	// 愿�由ъ옄 �뿬遺�
				
			} else if("EXCEL0005".equals(fileCode) ) {
				
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// �꽭�뀡 �젙蹂�
				String mno = sessionVo.getMEMBER_NO();									// 濡쒓렇�씤 �쉶�썝踰덊샇
				
				// �꽭�뀡 VO�뿉 �꽭�뀡 媛� ���옣
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//愿�由ъ옄 �뿬遺�

				searchData.put("MEMBER_NO", mno);		// �궗�썝踰덊샇
				searchData.put("isAdmin", isAdmin);	// 愿�由ъ옄 �뿬遺�
			} else if("EXCEL0006".equals(fileCode) ) {
				HttpSession session = request.getSession();
				
				SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// �꽭�뀡 �젙蹂�
				String mno = sessionVo.getMEMBER_NO();									// 濡쒓렇�씤 �쉶�썝踰덊샇
				
				// �꽭�뀡 VO�뿉 �꽭�뀡 媛� ���옣
				String isAdmin = (String) session.getAttribute("IS_ADMIN");				//愿�由ъ옄 �뿬遺�
				//�씠�젰愿�由� �뿊�� �떎�슫濡쒕뱶
				
				String member_no = "";
				if("1".equals(isAdmin)) {
					member_no = (String)searchData.get("select_member_no");
				}else {
					member_no = mno;
				}
				
				if("".equals(member_no)) {
					searchData.put("MEMBER_NO", null);
				}else {
					searchData.put("MEMBER_NO", member_no);
				}
				
			}
			
			data.put("SEARCH_DATA", searchData);
		} else {
			data.put("SEARCH_DATA", new HashMap<String, Object>());
		}
		
		List<LinkedHashMap<String,Object>> list1 = null;
		List<LinkedHashMap<String,Object>> list2 = null;
		
		// �넻�떊鍮�, 援먰넻鍮� �넻怨�
		if("EXCEL0005".equals(fileCode)) {
			//�넻�떊鍮�
			data.put("FILE_CODE","EXCEL0005_1");
			list1 =  excelService.getCodetoList(data);
			//援먰넻鍮�
			data.put("FILE_CODE","EXCEL0005_2");
			try {
				list2 =  excelService.getTransList(data);
			} catch (ParseException e) {
				LOG.debug("ParseException e : " + e.getMessage());
			}
			
			data.put("FILE_CODE","EXCEL0005");
		} else {
			list1 =  excelService.getCodetoList(data);
		}
		
		if("EXCEL0005".equals(fileCode)) {
			// Month KEY Array
			String[] monthArray = {"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"};
			
			// �넻�떊鍮� & 援먰넻鍮� �빀怨� 
			
			for(int i = 0; i < list1.size(); i++) {
				int commTotalAmount = 0;
				int transTotalAmount = 0;
				for(int j = 0; j < monthArray.length; j++) {
					commTotalAmount += Integer.parseInt((String) list1.get(i).get(monthArray[j]));
					// 吏곸썝�쓽 �넻�떊鍮� 珥앺빀怨�
					list1.get(i).put("합계", commTotalAmount);
				}
				for(int j = 0; j < monthArray.length; j++) {
					transTotalAmount += (Double)list2.get(i).get(monthArray[j]);
					// 吏곸썝�쓽 援먰넻鍮� 珥앺빀怨�
					list2.get(i).put("합계", transTotalAmount);
				}
				
				// 吏곸썝�쓽 珥앺빀怨�
				list1.get(i).put("총합계", transTotalAmount+commTotalAmount);
			}
		}
		
		response.setHeader("fileName", fileName);
		try {
			//�뿊�� �뙆�씪 �깮�꽦 諛� �떎�슫濡쒕뱶
			if("EXCEL0005".equals(fileCode)) {
				fileController.exportExceptionExcel(list1, list2, fileName, response);
			} else {
				fileController.exportExcel(list1, fileName,"","", response);
			}
			
		}catch(Exception e) {
			LOG.debug("Exception : " + e.getMessage());
		}
		
	}
}