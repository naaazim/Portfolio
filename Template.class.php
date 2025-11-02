<?php
class Template{
    //variables d'instance
    private $template;
    //constructeur
    function __construct($template){
        $this->template = file_get_contents($template);
        if($this->template === false){
            echo "Erreur lors du chargement du fichier";
            exit();
        }
    }
    function Replace($label, $value){
        $this->template = str_replace($label, $value, $this->template);
    }
    function Display(){
        echo $this->template;
    }
}