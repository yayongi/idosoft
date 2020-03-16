package kr.co.idosoft.intranet.util;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
public class fileUpload {

    private static final Logger logger = LoggerFactory.getLogger(fileUpload.class);

    @RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	@ResponseBody
    public void upload(MultipartHttpServletRequest multiparthttpservletrequest) throws IOException {
        MultipartFile mf = multiparthttpservletrequest.getFile("file"); // jsp file name mapping
        String uploadPath = "";
        
        String path = multiparthttpservletrequest.getParameter("path"); // 파일 업로드 경로
            
        String original = mf.getOriginalFilename(); // 업로드하는 파일 name
            
        uploadPath = path+original; // 파일 업로드 경로 + 파일 이름
        
        try {
            mf.transferTo(new File(uploadPath)); // 파일을 위에 지정 경로로 업로드
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }
}