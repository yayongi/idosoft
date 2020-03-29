package kr.co.idosoft.intranet.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;


@Controller
public class fileController {

	private static final Logger logger = LoggerFactory.getLogger(fileController.class);

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	@ResponseBody
	public void uploadFile(MultipartHttpServletRequest multiparthttpservletrequest,HttpServletRequest request) throws IOException {
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		
		MultipartFile mf = multiparthttpservletrequest.getFile("file"); // jsp file name mapping

		String uploadPath = "";
		String detailPath = multiparthttpservletrequest.getParameter("path"); // 파일 업로드 경로
		String preFileName = multiparthttpservletrequest.getParameter("prefilename"); // 기종 파일 명
		String original = mf.getOriginalFilename(); // 업로드하는 파일 name

		uploadPath = path+detailPath+original; // 파일 업로드 경로 + 파일 이름
		
		logger.debug("업로드 파일 경로 : " + uploadPath);
		
		File file = new File(uploadPath);

		try {
			if(!file.exists()) {
				file.mkdirs();
			}
			mf.transferTo(file); // 파일을 위에 지정 경로로 업로드
			
			//기존 파일 삭제 로직
			if(!"".equals(preFileName) && preFileName != null) {
				
				logger.debug("삭제 경로 : " + detailPath+preFileName);
				deleteFile(preFileName,path+detailPath);
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
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		try{
		
			String fileName = request.getParameter("filename"); 
			//인터넷 익스플로러 구분
			if(request.getHeader("user-agent").indexOf("MSIE") == -1) {
				fileName = new String(fileName.getBytes("UTF-8"),"8859_1");
			}else {
				fileName = new String(fileName.getBytes("EUC-KR"),"8859_1");
			}
			String filePath = request.getParameter("path");
			String fileFullPath = path + filePath + fileName;
		
			logger.debug("파일 경로 : " + fileFullPath);
			
			File file = new File(fileFullPath);
			if(file.exists()) {
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Transfer-Encoding", "binary"); 
				response.setHeader("content-disposition", "attachment;fileName=\""+fileName+"\";");
				response.setHeader("filename", URLEncoder.encode(fileName, "UTF-8"));
				
				FileInputStream fileinputstream = new FileInputStream(file);
				ServletOutputStream servletoutputstream = response.getOutputStream();
				BufferedOutputStream bufferedoutputstream=new BufferedOutputStream(servletoutputstream);
				
				byte readByte[] = new byte[1024];
				int data = 0;
				while((data = fileinputstream.read(readByte,0,readByte.length)) != -1) {
					bufferedoutputstream.write(readByte,0,data);
				}
				
				servletoutputstream.flush();
				servletoutputstream.close();
				fileinputstream.close();
				bufferedoutputstream.flush();
				bufferedoutputstream.close();
				logger.debug("파일 다운로드가 완료 되었습니다.");
			}else {
				logger.debug("파일이 존재하지 않습니다.");
			}
		}
		catch (Exception e){
			logger.debug("파일다운로드에 실패하였습니다.");
			e.printStackTrace();
		}
	}
}