package kr.co.idosoft.intranet.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLEncoder;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.common.io.ByteStreams;

@Controller
public class fileController {

	private static final Logger logger = LoggerFactory.getLogger(fileController.class);

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	@ResponseBody
	public void uploadFile(MultipartHttpServletRequest multiparthttpservletrequest) throws IOException {
		MultipartFile mf = multiparthttpservletrequest.getFile("file"); // jsp file name mapping

		String uploadPath = "";
		String path = multiparthttpservletrequest.getParameter("path"); // 파일 업로드 경로
		String preFileName = multiparthttpservletrequest.getParameter("prefilename"); // 기종 파일 명
		String original = mf.getOriginalFilename(); // 업로드하는 파일 name

		uploadPath = path+original; // 파일 업로드 경로 + 파일 이름

		try {
			mf.transferTo(new File(uploadPath)); // 파일을 위에 지정 경로로 업로드
			//기존 파일 삭제 로직

			logger.debug(preFileName);
			if(!"".equals(preFileName) || preFileName != null) {
				deleteFile(preFileName,path);
			}
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	//파일삭제
	public void deleteFile(String fileName,String filePath) {

		logger.debug(filePath+fileName);

		File file = new File(filePath+fileName); 
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

	//파일 다운로드
	@RequestMapping(value = "/fileDownload", method = RequestMethod.POST)
	@ResponseBody
	public void downloadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String fileName = request.getParameter("filename");
		String filePath = request.getParameter("path");

		try{
			
		}
		catch (Exception e){
			logger.debug("파일다운로드 실패");
			logger.debug("message : " + e.getMessage());
		}
	}
}