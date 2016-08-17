Imports Microsoft.Win32
Imports System.Text
Imports System.Security.Cryptography
Imports System.IO
Imports System.Threading
Imports System.Text.RegularExpressions

Imports System.Xml
Imports System.Web
Imports System.Data
Imports System.Globalization
Imports System.Runtime.InteropServices
Imports System.Drawing.Drawing2D
Imports System.Drawing
Public Class Form1

    Private Sub OpenToolStripMenuItem_Click(sender As Object, e As EventArgs) Handles OpenToolStripMenuItem.Click
        Dim d As New OpenFileDialog
        d.DefaultExt = "*.html"
        d.SupportMultiDottedExtensions = True
        d.Filter = "*.htm|*.html"
        d.ShowDialog()
        If d.FileName <> "" Then
            WebBrowser1.Navigate(d.FileName)

        End If
    End Sub

    Private Sub OpenFileDialog1_FileOk(sender As Object, e As System.ComponentModel.CancelEventArgs) Handles OpenFileDialog1.FileOk

    End Sub

    Private Sub OpenURLToolStripMenuItem_Click(sender As Object, e As EventArgs) Handles OpenURLToolStripMenuItem.Click
        Dim ret As String = InputBox("Enter URL you want to oopen", "Load web Page")
        If ret <> "" Then
            WebBrowser1.Navigate(ret)

        End If
    End Sub

    Private Sub SaveAsMHTToolStripMenuItem_Click(sender As Object, e As EventArgs) Handles SaveAsMHTToolStripMenuItem.Click
        Dim d As New SaveFileDialog
        d.DefaultExt = "*.mht"
        d.SupportMultiDottedExtensions = True
        d.Filter = "WEB Archive|*.mht"
        d.ShowDialog()
        If d.FileName <> "" Then
            Dim fname As String = System.IO.Path.GetFileNameWithoutExtension(d.FileName)
            If fname <> "" Then
                Try
                    Dim url As String = WebBrowser1.Url.ToString()
                    Dim apppath As String = System.IO.Path.GetDirectoryName(d.FileName) & "\"
                    Dim t = New Get_Book_Page_Class(url, apppath, fname)
                    t.CallBack(AddressOf get_books_completed, "")

                    File.WriteAllText(apppath & fname & ".mht", "<html><title>" & fname & "</title><body><h1>Please Wait. Plugin Being Loaded ...<h1></body></html>")

                    t.start()



                    WebBrowser1.Navigate(apppath & fname & ".mht")

                    'SavePage(plugin_Tabs.SelectedTab.Tag, apppath & "plugins\" & fname & ".mht", fname)
                Catch ex As Exception
                    'MsgBox(Lang("DLG_Text34") & vbCrLf & ex.Message, MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, Lang("DLG_Title34"))
                End Try
                'Pop_Plugin_Tabs()
            Else
                ' MsgBox(Lang("DLG_Text35"), MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, Lang("DLG_Title35"))

            End If

        End If


    End Sub
    Private Sub get_books_completed(ByVal url As String) ' Handles DL_PAge_.Finished
        Try
            WebBrowser1.Navigate(url)
        Catch ex As Exception

        End Try
    End Sub
End Class
#Region "Get_Book_Page_Class"
Public Class Get_Book_Page_Class
    Private func_ As ThreadStart
    Private calback_ As ThreadStart

    Private thread_ As Thread
    Private timeout_ As Integer
    Private ret As Object
    Private SavePath_ As String
    Private URL_ As String
    Private SaveNAME_ As String
    Private doc As String
    Private host_path As String
    Dim complete As Boolean
    Dim callback_handler As MyHandler
    Dim Timer As Timers.Timer
    Public Event Finished(ByVal url As String)

    Public Delegate Sub MyHandler(ByVal url As String)




    Public ReadOnly Property ReturnValue As Object
        Get
            Return ret
        End Get
    End Property
    ''' <summary>
    ''' Create a new webpage downloader instance
    ''' </summary>
    ''' <param name="Url">Url to the page you are saving</param>
    ''' <param name="SavePath">path to save directory\</param>
    ''' <param name="SaveName">name of savefile</param>
    ''' <remarks></remarks>
    Public Sub New(ByVal Url As String, ByVal SavePath As String, ByVal SaveName As String)
        URL_ = Url
        SavePath_ = SavePath
        SaveNAME_ = SaveName
    End Sub
    Private Function DownloadString(ByVal request As String)
        Dim webClient As New System.Net.WebClient
        Dim result As String = ""
        Try
            result = webClient.DownloadString(request)
        Catch
            Return ""
        End Try
        Return result
    End Function
    ''' <summary>
    ''' Use this to start the thread
    ''' </summary>
    ''' <remarks></remarks>
    Public Sub start()
        complete = False
        'Dim brws As New WebBrowser
        'brws.Navigate(URL_)
        'AddHandler brws.DocumentCompleted, AddressOf Me.docCompleted
        Dim Uri_ As New Uri(URL_)

        ' Console.WriteLine(myUri.Host)

        doc = DownloadString(URL_)


        ' host_path = Replace(Uri_.AbsoluteUri, Uri_.PathAndQuery, "/")
        host_path = System.IO.Path.GetDirectoryName(Uri_.AbsoluteUri) & "/"
        'brws.Dispose()


        Dim thread_ As System.Threading.Thread

        thread_ = New Thread(AddressOf Me.SavePage)
        thread_.IsBackground = True
        thread_.Start()


        Timer = New Timers.Timer(1000)
        Timer.AutoReset = True
        AddHandler Timer.Elapsed, AddressOf check_state
        Timer.Start()


    End Sub

    Public WriteOnly Property calback() As ThreadStart
        Set(ByVal value As ThreadStart)
            calback_ = value
        End Set
    End Property
    Public Sub CallBack(ByVal handler As MyHandler, ByVal url As String)
        callback_handler = handler
    End Sub
    'Public Sub run_CallBack(ByVal url)
    '    callback_handler(url)
    'End Sub
    Public Sub check_state()
        If complete Then
            'Dim tt As System.Threading.Thread
            'tt = New Thread(New ThreadStart(Sub() calback_()))
            'tt.SetApartmentState(ApartmentState.STA)
            'tt.Start(SavePath_ & SaveNAME_ & ".mht")
            'Thread.Join()
            Timer.Close()
            RaiseEvent Finished(SavePath_ & SaveNAME_ & ".mht")
            callback_handler(SavePath_ & SaveNAME_ & ".mht")


        End If
    End Sub


    Private Sub docCompleted(ByVal sender As Object, ByVal e As WebBrowserDocumentCompletedEventArgs)
        Dim brws As WebBrowser = DirectCast(sender, WebBrowser)
        doc = brws.DocumentText
        host_path = Replace(brws.Url.AbsoluteUri, brws.Url.PathAndQuery, "/")
        brws.Dispose()


        Dim thread_ As System.Threading.Thread

        thread_ = New Thread(AddressOf Me.SavePage)
        thread_.IsBackground = True
        thread_.Start()

    End Sub
    Private Sub SavePage()

        Dim src_m As String = ""

        If Directory.Exists(SavePath_ & SaveNAME_) Then Directory.Delete(SavePath_ & SaveNAME_, True)
        Directory.CreateDirectory(SavePath_ & SaveNAME_)
        ' Dim u As Uri
        Dim res_name As String = ""

        For Each match As Match In Regex.Matches(doc, "url\('*([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?'*\)", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            res_name = DL_resource(SavePath_ & SaveNAME_ & "\", host_path, match.Groups(1).Value)
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, SaveNAME_.Replace(" ", "%20") & "/" & res_name.Replace(" ", "%20"))

        Next
        Dim om As String = ""
        Dim doc2 As String = doc
        For Each match As Match In Regex.Matches(doc, "href\=([""'])([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?([""'])", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)

            res_name = DL_resource(SavePath_ & SaveNAME_ & "\", host_path, match.Groups(2).Value)
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(2).Value, SaveNAME_.Replace(" ", "%20") & "/" & res_name.Replace(" ", "%20"))

            If res_name = "" Then
                Dim u As String = match.Groups(2).Value
                If InStr(u, "http://") = 0 And InStr(u, "https://") = 0 And InStr(u, "ftp://") = 0 Then
                    doc = Replace(doc, match.Groups(1).Value & match.Groups(2).Value & match.Groups(3).Value, match.Groups(1).Value & host_path & match.Groups(2).Value & match.Groups(3).Value)
                End If
            End If

        Next


        For Each match As Match In Regex.Matches(doc, "src\=[""']([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?[""']", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            res_name = DL_resource(SavePath_ & SaveNAME_ & "\", host_path, match.Groups(1).Value)
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, SaveNAME_.Replace(" ", "%20") & "/" & res_name.Replace(" ", "%20"))
        Next

        Dim savef As New StreamWriter(SavePath_ & SaveNAME_ & ".mht")
        savef.WriteLine(doc)
        savef.Flush()
        savef.Close()
        complete = True



    End Sub
    Function DL_resource(ByVal Save_Path As String, ByVal host As String, ByVal path As String) As String

        'Check if path is full address.
        If Not Regex.IsMatch(path, "http(s)?://([\w+?\.\w+])+([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?") Then
            path = host & path
        End If

        Dim file_ As String = path
        Dim fname As String = ""
        Dim ext As String = ""

        Dim n As Integer = 0


        file_ = file_.Substring(file_.LastIndexOf("/"))
        file_ = file_.Replace("/", "")
        If Regex.IsMatch(file_, "(.*)\.(.*)") Then
            fname = file_.Substring(0, file_.LastIndexOf("."))
            'If file_ = "" Or file_.LastIndexOf(".") < 1 Then Return ""

            ext = file_.Substring(file_.LastIndexOf("."))
            ext = LCase(ext)
        End If
        If ext = ".gif" Or ext = ".jpg" Or ext = ".png" Or ext = ".bmp" Or ext = ".css" Or ext = ".txt" Then
            ' if this is a file and not a web page then download it
            Try
                Do While File.Exists(Save_Path & file_) = True
                    n = n + 1
                    file_ = fname & "_" & Trim(Str(n)) & ext
                Loop
                If Not File.Exists(Save_Path & file_) Then My.Computer.Network.DownloadFile(path, Save_Path & file_)

                '
                If ext = ".css" Then DL_Reap_Resource_Children(Save_Path & file_, host)
                Return file_
            Catch ex As Exception
                Return ""
            End Try
        Else
            'if its a link then return full path if needed
            Return ""

        End If
        Return ""
    End Function
    Sub DL_Reap_Resource_Children(ByVal file_ As String, ByVal host_path As String)

        Dim doc As String = File.ReadAllText(file_)
        Dim savename As String = Path.GetDirectoryName(file_)
        'Dim di As String = Split(StrReverse(savename), "\")(0)
        Dim res_name As String = ""
        Dim url As String = ""

        For Each match As Match In Regex.Matches(doc, "url\(\'?([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?\'?\)", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            If Mid(match.Groups(1).Value, 1, 1) = "/" Or Mid(match.Groups(1).Value, 1, 1) = "\" Then
                url = Mid(match.Groups(1).Value, 2, Len(match.Groups(1).Value) - 1)
            Else
                url = match.Groups(1).Value
            End If
            res_name = DL_resource(savename & "\", host_path, url)

            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, res_name.Replace(" ", "%20"))

        Next

        Dim savef As New StreamWriter(file_)
        savef.WriteLine(doc)
        savef.Flush()
        savef.Close()
    End Sub
End Class
#End Region