package kr.co.idosoft.intranet.member.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import kr.co.idosoft.common.util.SHAPasswordEncoder;
import kr.co.idosoft.common.util.StringUtils;
import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.member.model.service.MemberService;
import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.util.fileController;

@Controller
public class MemberController {
	private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
	
	private static final String INITPASSWORD = "idosoft1234"; // 珥덇린鍮꾨�踰덊샇
	
	@Resource MemberService memberService;
	
	@Autowired
	fileController file;
	
	
	// �궗�썝由ъ뒪�듃 遺덈윭�삤湲�
	@RequestMapping(value="/member/memberlist", method=RequestMethod.POST)
	@ResponseBody
	public LinkedHashMap<String, Object> getMemberList(Model model, HttpServletRequest request,HttpSession session){
		try {
			LinkedHashMap<String, Object> tempMap = new LinkedHashMap<String, Object>();
			tempMap.put("memberData", memberService.selectMemberList());
			tempMap.put("isAdmin", commonUtil.isAdmin(session));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	// �궗�썝�젙蹂� �벑濡앺븯湲�
	@RequestMapping(value="/member/memberinst", method=RequestMethod.POST)
	@ResponseBody
	public boolean insMemberInfo(Model model, @RequestBody MemberVO memberVo ,HttpServletRequest request){
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
				
		try {
			String member_no = "";
			try {
				member_no = memberService.findMemberNo(memberVo.getEntry_date());
				memberVo.setMember_no(Integer.toString(Integer.parseInt(member_no)+1));
			}catch(Exception e) {
				memberVo.setMember_no(memberVo.getEntry_date() + "01");
			}
			logger.debug("test1 : " + member_no );
			//logger.debug("test2 : " + Integer.toString(Integer.parseInt(member_no)+1) );
			
			SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
			shaPasswordEncoder.setEncodeHashAsBase64(true);
			
			memberVo.setPhoto_path(memberVo.getPhoto_path());
			memberVo.setCertfile_school_path(memberVo.getCertfile_school_path());
			memberVo.setCertfile_job_path(memberVo.getCertfile_job_path());

			//珥덇린 鍮꾨�踰덊샇 �븫�샇�솕
			memberVo.setPwd(shaPasswordEncoder.encode(INITPASSWORD));
			logger.debug("寃곌낵 : " + memberService.registerMember(memberVo));
			
			
			
			
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// �궗�썝�젙蹂� 遺덈윭�삤湲�
	@RequestMapping(value="/member/membersel/", method=RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> getMemberInfo(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		try {
			HashMap<String, Object> tempMap = new HashMap<String, Object>();
			tempMap.put("memberData",memberService.selectMember(memberVo.getMember_no()));
			tempMap.put("positionCode", memberService.getCodeInfo("CD0000"));
			tempMap.put("graduationCode", memberService.getCodeInfo("CD0001"));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	// �궗�썝�젙蹂� �닔�젙
	@RequestMapping(value="/member/memberupd/", method=RequestMethod.POST)
	@ResponseBody
	public boolean updMemberInfo(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		try {
			memberService.updateMember(memberVo);
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// �궗�썝�젙蹂� �닔�젙
	@RequestMapping(value="/member/initiallizepassword/", method=RequestMethod.POST)
	@ResponseBody
	public int initializePassword(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		try {
			SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
			shaPasswordEncoder.setEncodeHashAsBase64(true);
			
			//珥덇린 鍮꾨�踰덊샇 �븫�샇�솕
			memberVo.setPwd(shaPasswordEncoder.encode(INITPASSWORD));
			
			return memberService.initializePassword(memberVo);
		}catch(Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	// �궗�썝�젙蹂� �궘�젣
	@RequestMapping(value="/member/memberdel", method=RequestMethod.POST)
	@ResponseBody
	public boolean deleteMemberInfo(Model model, @RequestBody List<String> member_no_list,HttpServletRequest request){
		try {
			memberService.deleteMember(member_no_list);
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//吏곴툒 �젙蹂� 媛��졇�삤湲�
	@RequestMapping(value="/member/code", method=RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> getPosition(Model model, @RequestBody HashMap<String, String> code, HttpServletRequest request){
		try {
			HashMap<String, Object> tempMap = new HashMap<String, Object>();
			tempMap.put("positionCode", memberService.getCodeInfo(code.get("position_code_id")));
			tempMap.put("graduationCode", memberService.getCodeInfo(code.get("graduation_code_id")));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//�슂�씪 愿��젴 湲곕뀗�씪 媛��졇�삤湲�
	@RequestMapping(value="/member/getdate", method=RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> getDate(Model model, @RequestBody HashMap<String, String> date, HttpServletRequest request){
		try {
			
			HashMap<String, String> birthDate = new HashMap<String, String>();
			birthDate.put("solarDate",date.get("solarDate"));
			birthDate.put("moonDate",date.get("moonDate"));
			
			HashMap<String, Object> tempMap = new HashMap<String, Object>();
			tempMap.put("birthDate", memberService.getBirthDate(birthDate));
			tempMap.put("marriageDate", memberService.getMarriageDate(date.get("solarDate")));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//以묐났 �씠硫붿씪 以묐났 �솗�씤
	@RequestMapping(value="/member/checkemail", method=RequestMethod.POST)
	@ResponseBody
	public int checkemail(Model model, @RequestBody MemberVO memberVo, HttpServletRequest request){
		try {
			return memberService.checkemail(memberVo);
		}catch(Exception e) {
			e.printStackTrace();
			return 100;
		}
	}
	
	//�궗�썝 �젙蹂� �뿊�� 異쒕젰
	@RequestMapping(value="/member/exportexcel", method=RequestMethod.POST)
	@ResponseBody
	public void exportExcel(Model model, @RequestBody HashMap<String,Object> data, HttpServletRequest request,HttpServletResponse response){
		try {
			List<LinkedHashMap<String, Object>> memberVoList = (List<LinkedHashMap<String, Object>>)data.get("memeberList");
			// �꽑�깮�맂 吏곸썝 �젙蹂� 媛��졇�삤湲�
			List<LinkedHashMap<String,Object>> tempList =  memberService.exportExcelList(memberVoList);
			logger.debug("data : " + tempList);
			
			//�뿊�뀓 �뙆�씪 留뚮뱾�뼱�꽌 �떎�슫濡쒕뱶
			file.exportExcel(tempList,(String)data.get("title"),response);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}
