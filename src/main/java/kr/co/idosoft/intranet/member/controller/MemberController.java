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
	
	private static final String INITPASSWORD = "idosoft1234"; // �룯�뜃由곈뜮袁⑨옙甕곕뜇�깈
	
	@Resource MemberService memberService;
	
	@Autowired
	fileController file;
	
	
	// 占쎄텢占쎌뜚�뵳�딅뮞占쎈뱜 �겫�뜄�쑎占쎌궎疫뀐옙
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
	
	// 占쎄텢占쎌뜚占쎌젟癰귨옙 占쎈쾻嚥≪빜釉�疫뀐옙
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

			//�룯�뜃由� �뜮袁⑨옙甕곕뜇�깈 占쎈릊占쎌깈占쎌넅
			memberVo.setPwd(shaPasswordEncoder.encode(INITPASSWORD));
			logger.debug("野껉퀗�궢 : " + memberService.registerMember(memberVo));
			
			
			
			
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	// 占쎄텢占쎌뜚占쎌젟癰귨옙 �겫�뜄�쑎占쎌궎疫뀐옙
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
	
	// 占쎄텢占쎌뜚占쎌젟癰귨옙 占쎈땾占쎌젟
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
	
	// 占쎄텢占쎌뜚占쎌젟癰귨옙 占쎈땾占쎌젟
	@RequestMapping(value="/member/initiallizepassword/", method=RequestMethod.POST)
	@ResponseBody
	public int initializePassword(Model model, @RequestBody MemberVO memberVo,HttpServletRequest request){
		try {
			SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
			shaPasswordEncoder.setEncodeHashAsBase64(true);
			
			//�룯�뜃由� �뜮袁⑨옙甕곕뜇�깈 占쎈릊占쎌깈占쎌넅
			memberVo.setPwd(shaPasswordEncoder.encode(INITPASSWORD));
			
			return memberService.initializePassword(memberVo);
		}catch(Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	// 占쎄텢占쎌뜚占쎌젟癰귨옙 占쎄텣占쎌젫
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
	
	//筌욊낫�닋 占쎌젟癰귨옙 揶쏉옙占쎌죬占쎌궎疫뀐옙
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
	
	//占쎌뒄占쎌뵬 �꽴占쏙옙�졃 疫꿸퀡�쀯옙�뵬 揶쏉옙占쎌죬占쎌궎疫뀐옙
	@RequestMapping(value="/member/getdate", method=RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> getDate(Model model, @RequestBody HashMap<String, String> date, HttpServletRequest request){
		try {
			
			HashMap<String, String> birthDate = new HashMap<String, String>();
			birthDate.put("solarDate",date.get("solarDate").substring(4));
			birthDate.put("moonDate",date.get("moonDate").substring(4));
			
			HashMap<String, Object> tempMap = new HashMap<String, Object>();
			tempMap.put("birthDate", memberService.getBirthDate(birthDate));
			tempMap.put("marriageDate", memberService.getMarriageDate(date.get("solarDate").substring(4)));
			return tempMap;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//餓λ쵎�궗 占쎌뵠筌롫뗄�뵬 餓λ쵎�궗 占쎌넇占쎌뵥
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
	
	//占쎄텢占쎌뜚 占쎌젟癰귨옙 占쎈퓡占쏙옙 �빊�뮆�젾
	@RequestMapping(value="/member/exportexcel", method=RequestMethod.POST)
	@ResponseBody
	public void exportExcel(Model model, @RequestBody HashMap<String,Object> data, HttpServletRequest request,HttpServletResponse response){
		try {
			List<LinkedHashMap<String, Object>> memberVoList = (List<LinkedHashMap<String, Object>>)data.get("memeberList");
			// 占쎄퐨占쎄문占쎈쭆 筌욊낯�뜚 占쎌젟癰귨옙 揶쏉옙占쎌죬占쎌궎疫뀐옙
			List<LinkedHashMap<String,Object>> tempList =  memberService.exportExcelList(memberVoList);
			logger.debug("data : " + tempList);
			
			//占쎈퓡占쎈�� 占쎈솁占쎌뵬 筌띾슢諭억옙堉깍옙苑� 占쎈뼄占쎌뒲嚥≪뮆諭�
			file.exportExcel(tempList,(String)data.get("title"),(String)data.get("category"),(String)data.get("searchword"),response);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}
