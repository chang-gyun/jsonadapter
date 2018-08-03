package kr.justux.guava;
 
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.google.gson.Gson;



@Controller
public class JsonAdapter {
     
    @Autowired
    private SqlSession sqlSession;
     
    
    @RequestMapping(value = "/api", method = RequestMethod.POST)
    public String api(Model model,
    					@RequestParam("sp_type") String sp_type,
    					@RequestParam("sp_name") String sp_name,
			            @RequestParam("sp_param") String sp_param
				       ) {
     
    	Gson gson = new Gson();
        
    	//System.out.println(sp_param);
    	
    	
    	HashMap<String, String> paramMap = new HashMap<String, String>();
    	paramMap = gson.fromJson(sp_param, paramMap.getClass());
    

        List<?> resultList = null; 
        boolean retCode = true;
        String error_msg = "";
        String error_code = "";
        int retcnt = 0;
        		
        //System.out.println(paramMap.get("id"));
        //System.out.println(sp_type);

        
    	try {
    		if(sp_type.equals("getDBFunc")) {
    			resultList = sqlSession.selectList(sp_name, paramMap);
    			retcnt = resultList.size();
            }
    		if(sp_type.equals("setDBFunc")) {
    			retcnt = sqlSession.update(sp_name, paramMap);
    			
            }
    		
		} catch (Exception e) {
			System.out.println(e);
			retCode = false;
			error_msg = "parameter checking error";
			
		}
    	
    	LinkedHashMap<String,Object> resultMap  = new LinkedHashMap<String,Object>();
    	
  
    	resultMap.put("code", retCode);
    	resultMap.put("error_msg", error_msg);
    	resultMap.put("data", resultList);
    	resultMap.put("retcnt", retcnt);
    	
    	//resultMap.put("sp_param", paramMap);
    	
    	
    	String json = gson.toJson(resultMap);
        
    	
    	
    	System.out.println(json);
		model.addAttribute("data", json);
		
        return "/adapter/adapter";
    }
     
}