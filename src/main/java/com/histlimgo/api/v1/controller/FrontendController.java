package com.histlimgo.api.v1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = "/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/{path:[^\\.]*}/{subpath:[^\\.]*}")
    public String redirect2() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/{path:[^\\.]*}/{subpath:[^\\.]*}/{subsubpath:[^\\.]*}")
    public String redirect3() {
        return "forward:/index.html";
    }
}
