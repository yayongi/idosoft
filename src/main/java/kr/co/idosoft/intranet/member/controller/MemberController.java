package kr.co.idosoft.intranet.member.controller;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import kr.co.idosoft.common.util.SHAPasswordEncoder;
import kr.co.idosoft.intranet.member.model.service.MemberService;
import kr.co.idosoft.intranet.member.vo.MemberVO;

@Controller
public class MemberController {
	private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
	
	private static final String INITPASSWORD = "idosoft1234"; // 초기비밀번호
	
	@Resource MemberService memberService;
	
	
	// 사원리스트 불러오기
	@RequestMapping(value="/member/memberlist", method=RequestMethod.POST)
	@ResponseBody
	public List<Object> getMemberList(Model model, HttpServletRequest request){
		return memberService.selectMemberList();
	}
	
	// 사원정보 등록하기
	@RequestMapping(value="/member/memberinst", method=RequestMethod.POST)
	@ResponseBody
	public boolean insMemberInfo(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
				
		try {
			SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
			shaPasswordEncoder.setEncodeHashAsBase64(true);
			
			memberVo.setPhoto_path(memberVo.getPhoto_path());
			memberVo.setCertfile_school_path(memberVo.getCertfile_school_path());
			memberVo.setCertfile_job_path(memberVo.getCertfile_job_path());

			//초기 비밀번호 암호화
			memberVo.setPwd(shaPasswordEncoder.encode(INITPASSWORD));
			logger.debug("결과 : " + memberService.registerMember(memberVo));
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// 사원정보 불러오기
	@RequestMapping(value="/member/memberreg/", method=RequestMethod.POST)
	@ResponseBody
	public MemberVO getMemberInfo(Model model, @RequestBody String member_no,HttpServletRequest request){
		return memberService.selectMember(member_no);
	}
	
	// 사원정보 수정
	@RequestMapping(value="/member/memberupd", method=RequestMethod.POST)
	@ResponseBody
	public boolean updMemberInfo(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		try {
			memberService.updateMember(memberVo);
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	// 사원정보 삭제
	@RequestMapping(value="/member/memberdel", method=RequestMethod.POST)
	@ResponseBody
	public boolean deleteMemberInfo(Model model, @RequestBody String member_no,HttpServletRequest request){
		try {
			memberService.deleteMember(member_no);
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	//직급 정보 가져오기
	@RequestMapping(value="/member/code", method=RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> getPosition(Model model, @RequestBody HashMap<String, String> code, HttpServletRequest request){
		try {
			HashMap<String, Object> tempMap = new HashMap<String, Object>();
			tempMap.put("positionCode", memberService.getCode(code.get("position_code_id")));
			tempMap.put("graduationCode", memberService.getCode(code.get("graduation_code_id")));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//학위 정보 가져오기
		@RequestMapping(value="/member/graduation", method=RequestMethod.POST)
		@ResponseBody
		public List<Object> getGraduation(Model model, @RequestBody HashMap<String, String> code, HttpServletRequest request){
			try {
				return memberService.getCode(code.get("code_id"));
			}catch(Exception e) {
				e.printStackTrace();
				return null;
			}
		}
	
}
