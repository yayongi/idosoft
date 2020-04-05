package kr.co.idosoft.intranet.util;

import java.io.BufferedOutputStream;
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
			String detailPath = ""; // �뙆�씪 �뾽濡쒕뱶 寃쎈줈 
	        String preFileName = ""; // 湲곗쥌 �뙆�씪 紐� 
	        String savedName = ""; // ���옣�븷 �뙆�씪紐�
			
			
			Iterator<String> iter = multipartservletrequest.getFileNames(); 
		    MultipartFile mfile = null; 
		    String fieldName = "";
		    while (iter.hasNext()) { 
		        fieldName = (String) iter.next(); //�뙆�씪�씠由�, �쐞�뿉�꽌 file1怨� file2濡� 蹂대깉�쑝�땲 file1, file2濡� �굹�삩�떎.
		        mfile = multipartservletrequest.getFile(fieldName);  //���옣�맂 �뙆�씪 媛앹껜
		        logger.debug("file : " + mfile.getOriginalFilename());
		        
		        HashMap<String, String> tempMap = new HashMap<String, String>();
		    	tempMap = tempList.get(index);
		        detailPath = tempMap.get("path"); // �뙆�씪 �뾽濡쒕뱶 寃쎈줈 
		        preFileName = tempMap.get("prefilename"); // 湲곗쥌 �뙆�씪 紐� 
		        savedName = tempMap.get("savedName"); // ���옣�븷 �뙆�씪紐�
		        logger.debug("path : " + detailPath);
		        logger.debug("preFileName : " + preFileName);
		        logger.debug("savedName : " + savedName);
		        
		        uploadPath = path+detailPath+savedName; // �뙆�씪 �뾽濡쒕뱶 寃쎈줈 + �뙆�씪 �씠由�
		        
		        logger.debug("�뾽濡쒕뱶 �뙆�씪 寃쎈줈 : " + uploadPath);
		        
		        File file = new File(uploadPath);
		        
		        try {
		        	// 寃쎈줈媛� �뾾�쑝硫� 寃쎈줈瑜� 留뚮뱺�떎.
		        	if(!file.exists()) { 
		        		file.mkdirs(); 
		        	} 
		        	
		        	mfile.transferTo(file); // �뙆�씪�쓣 �쐞�뿉 吏��젙 寃쎈줈濡� �뾽濡쒕뱶
		        	
		        	//湲곗〈 �뙆�씪 �궘�젣 濡쒖쭅 
		        	if(!"".equals(preFileName) && preFileName != null) {
		        		logger.debug("�궘�젣 寃쎈줈 : " + detailPath+preFileName);
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
	//�뙆�씪�궘�젣
	public void deleteFile(String fileName,String filePath) {

		logger.debug(filePath+fileName);

		File file = new File(filePath+fileName); 
		if( file.exists() ){ 
			if(file.delete()){ 
				System.out.println("�뙆�씪�궘�젣 �꽦怨�"); 
			}else{ 
				System.out.println("�뙆�씪�궘�젣 �떎�뙣"); 
			} 
		}else{ 
			System.out.println("�뙆�씪�씠 議댁옱�븯吏� �븡�뒿�땲�떎."); 
		} 

	}

	//�뙆�씪 �떎�슫濡쒕뱶
	@RequestMapping(value = "/fileDownload", method = RequestMethod.POST)
	@ResponseBody
	public void downloadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		try{
		
			String fileName = request.getParameter("filename"); 
			//�씤�꽣�꽬 �씡�뒪�뵆濡쒕윭 援щ텇
			if(request.getHeader("user-agent").indexOf("MSIE") == -1) {
				fileName = new String(fileName.getBytes("UTF-8"),"8859_1");
			}else {
				fileName = new String(fileName.getBytes("EUC-KR"),"8859_1");
			}
			String filePath = request.getParameter("path");
			String fileFullPath = path + filePath + fileName;
			logger.debug("寃쎈줈 : "+path);
		
			logger.debug("�뙆�씪 寃쎈줈 : " + fileFullPath);
			
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
				logger.debug("�뙆�씪 �떎�슫濡쒕뱶媛� �셿猷� �릺�뿀�뒿�땲�떎.");
			}else {
				logger.debug("�뙆�씪�씠 議댁옱�븯吏� �븡�뒿�땲�떎.");
			}
		}
		catch (Exception e){
			logger.debug("�뙆�씪�떎�슫濡쒕뱶�뿉 �떎�뙣�븯���뒿�땲�떎.");
			e.printStackTrace();
		}
	}
	
	// �뿊�� �뙆�씪 �깮�꽦 異쒕젰
	public void exportExcel(List<LinkedHashMap<String,Object>> memberData, String title,HttpServletResponse response){
		try {
			HSSFWorkbook workbook = new HSSFWorkbook();
			
			Sheet sheet = workbook.createSheet("sheet");	//�빐�떦 �뙆�씪�씠 �깮�꽦 �맆 Sheet紐�
		    Row row = null;									//�뻾 ->
		    Cell cell = null; 								// �뻾�븞�뿉 �븳移명븳移�
		    int rowNo = 0;
		    int cellNo = 0;
		    
		    //�뿤�뜑 �겢�옄 Bold
		    Font font = workbook.createFont();
		    font.setBold(true);
		    
		    // �뀒�씠釉� �뿤�뜑�슜 �뒪���씪
		    CellStyle headStyle = workbook.createCellStyle();

		    headStyle.setBorderTop(BorderStyle.THIN);
		    headStyle.setBorderBottom(BorderStyle.THIN);
		    headStyle.setBorderLeft(BorderStyle.THIN);
		    headStyle.setBorderRight(BorderStyle.THIN);
		    headStyle.setFont(font);
		    
		    // �뿤�뜑 �깮�꽦
		    LinkedHashMap<String, Object> headerData = memberData.get(0);
		    
		    // �씠�꽣�젅�씠�꽣 �씠�슜�빐�꽌 key 媛믪쑝濡� �뿤�뜑 留뚮뱾湲�
		    Set<String> set = headerData.keySet();
		    Iterator<String> iterator = set.iterator();

		    //0踰� row
		    row = sheet.createRow(rowNo++);
		    
		    // �뜲�씠�꽣 留듯븨�슜 由ъ뒪�듃
		    List<String> tempList = new ArrayList<String>();
		    
		    //Key 媛믪쓣 �뿤�뜑�뿉 �꽔�뼱 以��떎.
		    while(iterator.hasNext()){
				String key = (String)iterator.next();
				cell = row.createCell(cellNo++);
				cell.setCellStyle(headStyle);
				cell.setCellValue(key);
				tempList.add(key);
	    	}
		    // �뜲�씠�꽣 遺�遺� �깮�꽦
		    for(int i = 0; i < memberData.size();i++) {
		    	LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
		    	data = memberData.get(i);
		    	row = sheet.createRow(rowNo++);
		    	for(int j = 0;j < data.size();j++) {
		    		cell = row.createCell(j);
		    		
		    		Object tempData = data.get(tempList.get(j));
		    		
		    		//null 처리
		    		if(tempData == null) {
		    			tempData = "";
		    		}
		    		
		    		// 媛앹껜 ���엯�뿉 �뵲瑜� 泥섎━
		    		if(tempData instanceof Boolean) {
		    			cell.setCellValue((Boolean)tempData);
		    		}else if(tempData instanceof String){
		    			cell.setCellValue((String)tempData);
		    		}else if(tempData instanceof Integer) {
		    			cell.setCellValue((String)tempData);
		    		}
		    	}
		    }
		    
		    //LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();
	    	//data = memberData.get(0);
		    // CELL �겕湲� �옄�룞 議곗젙
		    //for(int k = 0;k < data.size();k++) {
		    	//sheet.autoSizeColumn(k);
		    //}
		    // 而⑦뀗痢� ���엯怨� �뙆�씪紐� 吏��젙
		    response.setContentType("application/download;charset=utf-8");
		    response.setHeader("Content-Disposition", "attachment;filename="+new String(title.getBytes("utf-8"),"8859_1"));
			response.setHeader("Content-Transfer-Encoding", "binary");
			//response.setHeader("filename", new String(title.getBytes("utf-8"),"8859_1"));
		    
		    // �뿊�� 異쒕젰
		    workbook.write(response.getOutputStream());
		    workbook.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}










