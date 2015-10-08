<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script src="libs/angular.min.js"></script> <!--place angular in head to support cloaking-->
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    
    <link rel="Stylesheet" type="text/css" href="css/App.min.css" />

</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Sample Home Page
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div data-ng-app="app" data-ng-cloak id="appBody">

        <div class="container-fluid">             
            <data-ng-form name="theForm" novalidate>
                <div class="row">            
                   <div class="col-sm-12">                
                        <div data-ng-view>
                            &nbsp;    
                        </div>
               
                   </div>
                </div>
            </data-ng-form>
        </div>
    </div>
    <script src="blocks/utils.module.js"></script>
    <script src="data/data.module.js"></script>
    <script src="blocks/logger.module.js"></script>
    <script src="home/home.module.js"></script>
    <script src="app.core.module.js"></script>
    <script src="app.module.js"></script>
    
    <script src="libs/angular-route.min.js"></script>
    <script src="libs/angular-sanitize.min.js"></script>
    
    
    <script src="config.js"></script>
   
    <script src="blocks/constants.service.js"></script>
    <script src="libs/ui-bootstrap-tpls.min.js"></script>
    <script src="home/home.service.js"></script>
    <script src="home/home.controller.js"></script>
    <script src="blocks/logger.service.js"></script>
    <script src="blocks/utils.service.js"></script> 
    <script src="data/data.service.js"></script>
	<script src="home/welcome.directive.js"></script>
</asp:Content>
