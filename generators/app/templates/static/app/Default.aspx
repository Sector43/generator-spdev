<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script src="scripts/angular.min.js"></script> <!--place angular in head to support cloaking-->
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    
    <link rel="Stylesheet" type="text/css" href="Content/css/App.min.css" />

</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
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
    
    

    
    
    <script src="scripts/angular-route.min.js"></script>
    <script src="scripts/angular-sanitize.min.js"></script>
    <script src="App.js"></script>
    <script src="scripts/config.route.js"></script>
    <script src="shared/constantsservice.js"></script>
    
   
    <script src="scripts/modernizr.js"></script>
    <script src="scripts/ui-bootstrap-tpls.min.js"></script>
    <script src="home/home.controller.js"></script>
    
</asp:Content>
