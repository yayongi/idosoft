package kr.co.idosoft.intranet.resource.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.resource.service.ResourceServiceImpl;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;
import kr.co.idosoft.intranet.util.fileController;

/**
 * 
 * @author 源�以��꽑
 * @since 2020.03.25
 * @content Resource Controller
 */
@RestController
@RequestMapping("/resource")
public class ResourceController {
	
	private static final Logger logger = LoggerFactory.getLogger(ResourceController.class);
	
	@Autowired
	private ResourceServiceImpl resService;
	
	private static final String RES_CODE = "CD0004"; 			// �옄�썝醫낅쪟 肄붾뱶
	private static final String MARK_CODE = "CD0005";			// �젣議곗궗 肄붾뱶
	private static final String DISPLAY_SIZE_CODE = "CD0006"; 	// �솕硫댁궗�씠利� 肄붾뱶
	
	/**
	 * �옄�썝 �벑濡�
	 * @param request
	 * @param ResourceVO resVO
	 * @return boolean
	 */
	@PostMapping("/register")
	public boolean registResource(@RequestBody ResourceVO resVO, HttpServletRequest request) {
		
//		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		resVO.setReg_id(sessionVO.getMEMBER_NO());
		
		logger.debug("###########################################################");
		logger.debug("�옄�썝踰덊샇 : "+resVO);
		logger.debug("###########################################################");
		
		try {
			resService.inputResource(resVO);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/**
	 * �옄�썝 �닔�젙
	 * @param request
	 * @param ResourceVO resVO
	 * @return boolean
	 */
	@PostMapping("/modify")
	public boolean modifyResource(Model model, @RequestBody ResourceVO resVO, HttpServletRequest request) {
		//愿�由ъ옄 �뿬遺�
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
//		if(!isAdmin) {
			//愿�由ъ옄媛� �븘�땲硫� false
//			return false;
//		}
		
		
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		resVO.setUpd_id(sessionVO.getMEMBER_NO());
		
		try {
			if(0 < resService.modifyResource(resVO)) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * �옄�썝愿��젴 肄붾뱶/肄붾뱶紐�, �궗�썝踰덊샇/�궗�썝紐� 議고쉶
	 * @param request
	 * @return boolean
	 */
	@PostMapping("/get-restype")
	public ModelAndView getResType(HttpServletRequest request) {
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		Map<String, String> upper_codes = new HashMap<String, String>();
		upper_codes.put("resTypeData", RES_CODE);
		upper_codes.put("resProductData", MARK_CODE);
		upper_codes.put("resDisplaySizeData", DISPLAY_SIZE_CODE);
		
		Map<String, List<Object>> resSelectType = resService.getSelectType(upper_codes, isAdmin, (String)sessionVO.getMEMBER_NO());
		
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("resSelectType", resSelectType);
		mv.addObject("isAdmin", isAdmin);
		return mv;
	}
	/**
	 * �옄�썝 �궘�젣
	 * @param request
	 * @param ResourceVO resVO
	 * @return boolean
	 */
	@PostMapping("/delete")
	public boolean deleteResource(@RequestBody ResourceVO resVO, HttpServletRequest request) {
		try {
			if(0 < resService.deleteResource(resVO.getRes_no())) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * �옄�썝 �꽑�깮 �궘�젣
	 * @param request
	 * @param Map<String, List<Integer>> res_no_list
	 * @return boolean
	 */
	@PostMapping("/deletelist")
	public boolean  deleteResourceList(@RequestBody Map<String, List<Integer>> res_no_list, HttpServletRequest request) {
		//愿�由ъ옄 �뿬遺�
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		if(!isAdmin) {
			//愿�由ъ옄媛� �븘�땲硫� false
			return false;
		}
		try {
			resService.deleteResourceList(res_no_list);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/**
	 * �옄�썝 由ъ뒪�듃 議고쉶
	 * @param request
	 * @param Map<String, Object> data
	 * @return Map<String, Object>
	 */
	@PostMapping("/findlist")
	public Map<String, Object> findResourceList(HttpServletRequest request, @RequestBody Map<String, Object> data) {
		//愿�由ъ옄 �뿬遺�
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		Map<String, Object> searchData = (Map<String, Object>) data.get("state");
		logger.debug("#########################################################");
		logger.debug("isAdmin ? "+isAdmin);
		logger.debug("#########################################################");
		
		Map<String, Object> resultData = new HashMap<>();
		
		int count = resService.getListCount(searchData);
		resultData.put("count", count);
		resultData.put("isAdmin", isAdmin);
		//移댁슫�듃媛� 0�씪寃쎌슦 由ъ뒪�듃�뒗 諛섑솚�븯吏� �븡�쓬
		if(count == 0) {
			return resultData;
		}
		
		resultData.put("resData", resService.findResourceList(data));
		resultData.put("memberNo", sessionVO.getMEMBER_NO());
		
		return resultData;
	}
	/**
	 * �옄�썝 議고쉶
	 * @param ResourceVO resVO
	 * @return ResourceVO
	 */
	@PostMapping("/find")
	public ModelAndView findResourceInfo(@RequestBody ResourceVO resVO, HttpServletRequest request) {
		
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		ResourceVO resourceVO = resService.findResource(resVO.getRes_no());
		
		if(!isAdmin && !resourceVO.getReg_id().equals(sessionVO.getMEMBER_NO()) ) {
			mv.addObject("result", false);
			return mv;
		}
		mv.addObject("result", true);
		mv.addObject("resData",resourceVO);
		return mv;
	}
	/**
	 * �옄�썝愿��젴 肄붾뱶議고쉶
	 * @param request
	 * @return List<Object>
	 */
	@PostMapping("/get-restype-code")
	public List<Object> getResTypeCode (HttpServletRequest request){
		return resService.getCode(RES_CODE);
	}
	
	/**
	 * �옄�썝�뿊�� 異쒕젰�슜 由ъ뒪�듃 議고쉶
	 * @param request
	 * @param HashMap<String,Object> data
	 * @param response
	 * @return List<Object>
	 */
	@RequestMapping(value="/exportexcel", method=RequestMethod.POST)
	public void exportExcel(@RequestBody HashMap<String,Object> data, HttpServletRequest request, HttpServletResponse response){
		try {
			// �꽑�깮�맂 吏곸썝 �젙蹂� 媛��졇�삤湲�
//			List<LinkedHashMap<String,Object>> tempList =  resService.exportExcel((List<String>)data.get("selected"));
			List<LinkedHashMap<String,Object>> tempList =  resService.exportExcel((HashMap<String, String>) data.get("searchState"));
			logger.debug("data : " + tempList);
			
			//�뿊�뀓 �뙆�씪 留뚮뱾�뼱�꽌 �떎�슫濡쒕뱶
			fileController file = new fileController();
			file.exportExcel(tempList,(String)data.get("title"),"","",response);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}
