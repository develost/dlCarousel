<?php
    include_once('simple_html_dom.php');
    $baseUrl = 'https://twitter.com/';
    //$userName = 'develost_com';
    header('Content-Type: application/json');
    
    if ((isset($_GET['s'])) && (isset($_GET['v']))){
        $searchType = $_GET['s'];
        $searchValue = $_GET['v'];
        
        if (0==strcmp($searchType,'user')){
            $url = $baseUrl . $searchValue;        
        }else if (0==strcmp($searchType,'hash')){
            $url = $baseUrl . 'search?q=%23' . $searchValue . '&src=typd&vertical=default&f=tweets';
        }else if (0==strcmp($searchType,'at')){
            $url = $baseUrl . 'search?q=%40' . $searchValue . '&src=typd&vertical=default&f=tweets';
        }else{
            $url = $baseUrl . 'develost_com';
        }
        
        //$url = $baseUrl . $userName;
        //$userAgent = $_SERVER['HTTP_USER_AGENT'];
        
        $userAgent ='Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36.';
        $acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
        $options = array('http'=>array('method'=>'GET','header'=>"Accept-language: ".$acceptLanguage."\r\n"."User-Agent: ".$userAgent."\r\n"));
        $context = stream_context_create($options);

        $postsPageHtml = str_get_html(file_get_contents($url, false, $context));
        $retval = array();
        
        foreach($postsPageHtml->find('.content') as $content){
            $postText = '';
            $postImageSrc = '';
            $postAuthor = '';
            //echo ".<br>";
            foreach ($content->find('.tweet-text') as $tweetText){
                $postText .= $tweetText->plaintext;
            }
            //echo "TEXT " . $postText . "<br>";
            foreach ($content->find('.media-forward') as $tweetA){
                $postImageSrc = $tweetA->attr['data-url'];
            }
            //echo "SRC " . $postImageSrc .  "<br>";
            $postUrl = $url;
            //echo "URL " . $postUrl .  "<br>";
            
            foreach ($content->find('.fullname') as $tweetAuthor){
                $postAuthor .= $tweetAuthor->plaintext;
            }
            //echo "AUTHOR " . $postAuthor .  "<br>";
            $jsonElement = array();
            $jsonElement['src'] = $postImageSrc;
            $jsonElement['url'] = $postUrl;
            $jsonElement['author'] = $postAuthor;
            $jsonElement['text'] = $postText;
            if (0 != strcmp($postImageSrc,'')){
                array_push($retval,$jsonElement);
            }
        }
        $stringRet = json_encode($retval);
        
        echo str_replace('\\/','/',$stringRet);        
        
        
    }else{
        echo '[]';
    }
    
    
    
    

?>