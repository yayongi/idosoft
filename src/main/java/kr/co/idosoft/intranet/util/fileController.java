package kr.co.idosoft.intranet.util;

import java.io.BufferedOutputStream;
import java.io.Console;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import kr.co.idosoft.intranet.member.vo.MemberVO;


@Controller
public class fileController {

	private static final Logger logger = LoggerFactory.getLogger(fileController.class);

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	@ResponseBody
	public void uploadFile(@RequestParam HashMap<String, Object> param, MultipartHttpServletRequest multipartservletrequest, HttpServletRequest request){
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<HashMap<String, String>> tempList = mapper.readValue((String)param.get("paramData"), List.class);
			
			int index = 0;
			String uploadPath = "";
			String detailPath = ""; // 파일 업로드 경로 
	        String preFileName = ""; // 기종 파일 명 
	        String savedName = ""; // 저장할 파일명
			
			
			Iterator<String> iter = multipartservletrequest.getFileNames(); 
		    MultipartFile mfile = null; 
		    String fieldName = "";
		    while (iter.hasNext()) { 
		        fieldName = (String) iter.next(); //파일이름, 위에서 file1과 file2로 보냈으니 file1, file2로 나온다.
		        mfile = multipartservletrequest.getFile(fieldName);  //저장된 파일 객체
		        logger.debug("file : " + mfile.getOriginalFilename());
		        
		        HashMap<String, String> tempMap = new HashMap<String, String>();
		    	tempMap = tempList.get(index);
		        detailPath = tempMap.get("path"); // 파일 업로드 경로 
		        preFileName = tempMap.get("prefilename"); // 기종 파일 명 
		        savedName = tempMap.get("savedName"); // 저장할 파일명
		        logger.debug("path : " + detailPath);
		        logger.debug("preFileName : " + preFileName);
		        logger.debug("savedName : " + savedName);
		        
		        uploadPath = path+detailPath+savedName; // 파일 업로드 경로 + 파일 이름
		        
		        logger.debug("업로드 파일 경로 : " + uploadPath);
		        
		        File file = new File(uploadPath);
		        
		        try {
		        	// 경로가 없으면 경로를 만든다.
		        	if(!file.exists()) { 
		        		file.mkdirs(); 
		        	} 
		        	
		        	mfile.transferTo(file); // 파일을 위에 지정 경로로 업로드
		        	
		        	//기존 파일 삭제 로직 
		        	if(!"".equals(preFileName) && preFileName != null) {
		        		logger.debug("삭제 경로 : " + detailPath+preFileName);
					  	deleteFile(preFileName,path+detailPath);
					}
		        }catch(Exception e) {
		        	e.printStackTrace();
		        }
		        index++;
		    }
		}catch(Exception e) {
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
			logger.debug("경로 : "+path);
		
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
	
	// 엑셀 파일 생성 출력
	public void exportExcel(List<LinkedHashMap<String,Object>> memberData, String title,HttpServletResponse response){
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();
			
			Sheet sheet = workbook.createSheet("sheet");	//해당 파일이 생성 될 Sheet명
		    Row row = null;									//행 ->
		    Cell cell = null; 								// 행안에 한칸한칸
		    int rowNo = 0;
		    int cellNo = 0;
		    
		    //헤더 클자 Bold
		    Font font = workbook.createFont();
		    font.setBold(true);
		    
		    // 테이블 헤더용 스타일
		    CellStyle headStyle = workbook.createCellStyle();

		    headStyle.setBorderTop(BorderStyle.THIN);
		    headStyle.setBorderBottom(BorderStyle.THIN);
		    headStyle.setBorderLeft(BorderStyle.THIN);
		    headStyle.setBorderRight(BorderStyle.THIN);
		    headStyle.setFont(font);
		    
		    // 헤더 생성
		    LinkedHashMap<String, Object> headerData = memberData.get(0);
		    
		    // 이터레이터 이용해서 key 값으로 헤더 만들기
		    Set<String> set = headerData.keySet();
		    Iterator<String> iterator = set.iterator();

		    //0번 row
		    row = sheet.createRow(rowNo++);
		    
		    // 데이터 맵핑용 리스트
		    List<String> tempList = new ArrayList<String>();
		    
		    //Key 값을 헤더에 넣어 준다.
		    while(iterator.hasNext()){
		    	
				String key = (String)iterator.next();
				
				logger.debug("#KEY[" + cellNo + "]" +  " : " + key);
				
				cell = row.createCell(cellNo++);
				cell.setCellStyle(headStyle);
				cell.setCellValue(key);
				tempList.add(key);
	    	}
		    // 데이터 부분 생성
		    for(int i = 0; i < memberData.size();i++) {
		    	LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
		    	data = memberData.get(i);
		    	row = sheet.createRow(rowNo++);
		    	for(int j = 0;j < data.size();j++) {
		    		cell = row.createCell(j);
		    		
		    		Object tempData = data.get(tempList.get(j));
		    		
		    		// 객체 타입에 따른 처리
		    		if(tempData instanceof Boolean) {
		    			cell.setCellValue((Boolean)tempData);
		    		}else if(tempData instanceof String){
		    			cell.setCellValue((String)tempData);
		    		}
		    	}
		    }
		    
		    //LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
	    	//data = memberData.get(0);
		    // CELL 크기 자동 조정
		    //for(int k = 0;k < data.size();k++) {
		    	//sheet.autoSizeColumn(k);
		    //}
		    // 컨텐츠 타입과 파일명 지정
		    response.setContentType("application/download;charset=utf-8");
		    response.setHeader("Content-Disposition", "attachment;filename="+new String(title.getBytes("utf-8"),"8859_1"));
			response.setHeader("Content-Transfer-Encoding", "binary");
			//response.setHeader("filename", new String(title.getBytes("utf-8"),"8859_1"));
		    
		    // 엑셀 출력
		    workbook.write(response.getOutputStream());
		    workbook.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	public void exportExcel(List<LinkedHashMap<String, Object>> list1, List<LinkedHashMap<String, Object>> list2,
			String title, HttpServletResponse response) {
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();
			
			Sheet sheet = workbook.createSheet("sheet");	//해당 파일이 생성 될 Sheet명
		    Row row = null;									//행 ->
		    Cell cell = null; 								// 행안에 한칸한칸
		    int rowNo = 0;
		    int cellNo = 0;
		    
		    //헤더 클자 Bold
		    Font font = workbook.createFont();
		    font.setBold(true);
		    
		    // 테이블 헤더용 스타일
		    CellStyle headStyle = workbook.createCellStyle();

		    headStyle.setBorderTop(BorderStyle.THIN);
		    headStyle.setBorderBottom(BorderStyle.THIN);
		    headStyle.setBorderLeft(BorderStyle.THIN);
		    headStyle.setBorderRight(BorderStyle.THIN);
		    headStyle.setFont(font);
		    
		    // 헤더 생성
		    LinkedHashMap<String, Object> headerData = list1.get(0);
		    
		    // 이터레이터 이용해서 key 값으로 헤더 만들기
		    Set<String> set = headerData.keySet();
		    Iterator<String> iterator = set.iterator();

		    //0번 row
		    row = sheet.createRow(rowNo++);
		    
		    // 데이터 맵핑용 리스트
		    List<String> tempList = new ArrayList<String>();
		    
		    //Key 값을 헤더에 넣어 준다.
		    while(iterator.hasNext()){
				String key = (String)iterator.next();
				
				logger.debug("#KEY[" + cellNo + "]" +  " : " + key);
				
				cell = row.createCell(cellNo++);
				cell.setCellStyle(headStyle);
				cell.setCellValue(key);
				tempList.add(key);
	    	}
		    // 데이터 부분 생성
		    LinkedHashMap<String, Object> data1 = new LinkedHashMap<String, Object>();
		    LinkedHashMap<String, Object> data2 = new LinkedHashMap<String, Object>();
		    
		    for(int i=0; i<list1.size(); i++) {
		    	data1 = list1.get(i);
		    	data2 = list2.get(i);
		    	
		    	row = sheet.createRow(rowNo++);
		    	for(int j=0; j<data1.size(); j++) {
		    		cell = row.createCell(j);
		    		
		    		Object tempData = data1.get(tempList.get(j));
		    		
		    		if(j == 3) {
		    			cell.setCellValue("통신비");
		    		} else {
		    			if(j > 3) {
		    				if(tempData instanceof String){
		    					cell.setCellValue(Integer.parseInt((String)tempData));
		    				} else {
		    					cell.setCellValue((Integer)tempData);
		    				}
		    			} else {
		    				// 객체 타입에 따른 처리
		    				if(tempData instanceof Boolean) {
		    					cell.setCellValue((Boolean)tempData);
		    				} else if(tempData instanceof String){
		    					cell.setCellValue((String)tempData);
		    				} else if(tempData instanceof Integer) {
		    					cell.setCellValue((Integer)tempData);
		    				} else if(tempData instanceof Double){
		    					cell.setCellValue((Double)tempData);
		    				}
		    			}
		    		}
		    		
		    		
		    	}
		    	row = sheet.createRow(rowNo++);
		    	for(int j=0; j<data1.size(); j++) {
		    		cell = row.createCell(j);
		    		
		    		if(j == 3) {
		    			cell.setCellValue("교통비");
		    		} else {
		    			Object tempData = data2.get(tempList.get(j));
		    			
		    			logger.debug("#tempData [" + j +"] : " + tempData);
		    			
		    			// 객체 타입에 따른 처리
		    			if(tempData instanceof Boolean) {
		    				cell.setCellValue((Boolean)tempData);
		    			} else if(tempData instanceof String){
		    				cell.setCellValue((String)tempData);
		    			} else if(tempData instanceof Integer) {
		    				cell.setCellValue((Integer)tempData);
		    			} else if(tempData instanceof Double){
		    				cell.setCellValue((Double)tempData);
		    			}
		    		}
		    	}
		    	
		    	//셀 병합
		    	sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,0,0)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
		    	sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,1,1)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
		    	sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,2,2)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
		    	sheet.addMergedRegion(new CellRangeAddress(rowNo-2,rowNo-1,17,17)); //열시작, 열종료, 행시작, 행종료 (자바배열과 같이 0부터 시작)
		    }
		    
		    //LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
	    	//data = memberData.get(0);
		    // CELL 크기 자동 조정
		    //for(int k = 0;k < data.size();k++) {
		    	//sheet.autoSizeColumn(k);
		    //}
		    // 컨텐츠 타입과 파일명 지정
		    response.setContentType("application/download;charset=utf-8");
		    response.setHeader("Content-Disposition", "attachment;filename="+new String(title.getBytes("utf-8"),"8859_1"));
			response.setHeader("Content-Transfer-Encoding", "binary");
			//response.setHeader("filename", new String(title.getBytes("utf-8"),"8859_1"));
		    
		    // 엑셀 출력
		    workbook.write(response.getOutputStream());
		    workbook.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}