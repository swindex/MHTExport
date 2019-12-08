Imports System.IO
Imports System.Text.RegularExpressions
Imports System.Threading

Public Class MHTExporter
    Private func_ As ThreadStart
    Private calback_ As ThreadStart

    Private thread_ As Thread
    Private timeout_ As Integer
    Private ret As Object
    Private SavePath_ As String
    Private URL_ As String

    Private doc As String
    Private host_path As String
    Dim complete As Boolean
    Dim callback_handler As MyHandler
    Dim Timer As Timers.Timer

    Dim strings As String
    Dim streams As String

    Dim fakeRootPath As String = "file:///C:/website/"
    Dim fakeAssetPath As String = "file:///C:/website/assets/"

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
    Public Sub New(ByVal Url As String, ByVal SavePath As String)
        URL_ = Url
        SavePath_ = SavePath

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
    Public Function FileName(path As String) As String
        Return System.IO.Path.GetFileNameWithoutExtension(path)

    End Function
    Public Function FileNameExt(path As String) As String
        Return System.IO.Path.GetFileName(path)

    End Function
    Public Function Ext(path As String) As String
        Return System.IO.Path.GetExtension(path)

    End Function
    Public Function Dirn(path As String) As String
        Return System.IO.Path.GetDirectoryName(path)

    End Function

    Public Function LineWrap(sb As String) As String
        Dim i As Integer = 76
        Do While i < sb.Length
            sb = sb.Insert(i, vbCrLf)
            i += 78
        Loop

        Return sb
    End Function
    Public Function LineWrap3(sb As String) As String
        Return sb
        Dim t As String = ""

        Dim spl As Integer = 74
        Dim n As Integer = 0

        For i As Integer = 1 To sb.Length
            Dim s As String = Mid(sb, i, 1)
            t &= s
            If s = vbLf Then n = -1

            If n = spl Then
                t &= "=" & vbCrLf
                n = -1
            End If

            n = n + 1
        Next

        Return t
    End Function
    Public Function ConvertFileToBase64(ByVal fileName As String) As String
        Dim sb As String = Convert.ToBase64String(System.IO.File.ReadAllBytes(fileName))
        Return LineWrap(sb)

    End Function
    Public Function ConvertTextToQuoted(ByVal sb As String) As String

        sb = Replace(sb, "=", "=3D")
        Return LineWrap3(sb)

    End Function
    Public Function ConvertFileToQuoted(ByVal fileName As String) As String
        Dim sb As String = System.IO.File.ReadAllText(fileName)

        sb = ConvertTextToQuoted(sb)
        Return LineWrap3(sb)

    End Function
    Function ConvertTextToStream(text As String, streamname As String) As String
        Dim s As String = ""
        Dim encoding As String = ""
        s =
        "Content-Type: " & GetMime(streamname, encoding) & vbCrLf &
        "Content-Transfer-Encoding: " & encoding & vbCrLf &
        "Content-Location: " & streamname & vbCrLf &
        vbCrLf & "=EF=BB=BF"

        If encoding = "quoted-printable" Then s &= ConvertTextToQuoted(text)
        s &= vbCrLf &
        "------=_NextPart_000_0000_01D02214.354132E0"
        Return s

    End Function
    Function AddFileToStream(filename As String, streamname As String) As String
        Dim s As String = ""
        Dim encoding As String = ""
        s = "" & vbCrLf &
        "Content-Type: " & GetMime(filename, encoding) & vbCrLf &
        "Content-Transfer-Encoding: " & encoding & vbCrLf &
        "Content-Location: " & streamname & vbCrLf & vbCrLf
        If encoding = "base64" Then s &= ConvertFileToBase64(filename)
        If encoding = "quoted-printable" Then s &= ConvertFileToQuoted(filename)
        s &= vbCrLf &
        "------=_NextPart_000_0000_01D02214.354132E0"
        ''Return s
        If encoding = "base64" Then streams &= s
        If encoding = "quoted-printable" Then strings &= s

    End Function
    Function GetMime(filename As String, ByRef encoding As String) As String
        Dim e As String = LCase(Ext(filename))
        encoding = "base64"
        Select Case e
            Case ".png"
                Return "image/png"
            Case ".jpg"
                Return "image/jpeg"
            Case ".jpeg"
                Return "image/jpeg"
            Case ".gif"
                Return "image/gif"
            Case ".bmp"
                Return "image/bmp"
            Case ".png"
                Return "image/png"
            Case ".css", ".js"
                encoding = "quoted-printable"
                Return "text/css;" & vbCrLf & vbTab & "charset=""utf-8"""
            Case ".html", ".htm"
                encoding = "quoted-printable"
                Return "text/html;" & vbCrLf & vbTab & "charset=""utf-8"""

        End Select

    End Function
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
            RaiseEvent Finished(SavePath_)
            callback_handler(SavePath_)


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

        If Directory.Exists(Dirn(SavePath_) & "\" & FileName(SavePath_)) Then
            Directory.Delete(Dirn(SavePath_) & "\" & FileName(SavePath_), True)
        End If
        Directory.CreateDirectory(Dirn(SavePath_) & "\" & FileName(SavePath_))
        ' Dim u As Uri
        Dim res_name As String = ""

        For Each match As Match In Regex.Matches(doc, "url\('*([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?'*\)", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            res_name = DL_resource(Dirn(SavePath_) & "\" & FileName(SavePath_) & "\", host_path, match.Groups(1).Value, "")
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, res_name)

        Next
        Dim om As String = ""
        Dim doc2 As String = doc
        For Each match As Match In Regex.Matches(doc, "href\=(?:""|')([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?(?:""|')", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)

            res_name = DL_resource(Dirn(SavePath_) & "\" & FileName(SavePath_) & "\", host_path, match.Groups(1).Value, "")
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, res_name.Replace(" ", "%20"))

            If res_name = "" Then
                Dim u As String = match.Groups(2).Value
                If InStr(u, "http://") = 0 And InStr(u, "https://") = 0 And InStr(u, "ftp://") = 0 Then
                    doc = Replace(doc, match.Groups(1).Value & match.Groups(2).Value & match.Groups(3).Value, match.Groups(1).Value & host_path & match.Groups(2).Value & match.Groups(3).Value)
                End If
            End If

        Next


        For Each match As Match In Regex.Matches(doc, "src\=(?:""|')([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?(?:""|')", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            res_name = DL_resource(Dirn(SavePath_) & "\" & FileName(SavePath_) & "\", host_path, match.Groups(1).Value, "")
            'src_m = Replace(match.Groups(1).Value, host_path, "")
            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, res_name.Replace(" ", "%20"))
        Next

        ''Dim savef As New StreamWriter(Dirn(SavePath_) & "\" & FileName(SavePath_) & ".html")
        'savef.WriteLine(doc)
        'savef.Flush()
        'savef.Close()

        writeMHT(doc)

        If Directory.Exists(Dirn(SavePath_) & "\" & FileName(SavePath_)) Then
            Directory.Delete(Dirn(SavePath_) & "\" & FileName(SavePath_), True)
        End If

        complete = True



    End Sub
    Sub writeMHT(body As String)
        Dim savef As New StreamWriter(Dirn(SavePath_) & "\" & FileName(SavePath_) & ".mht")
        Dim doc As String = ""
        doc &=
        "From: <Saved from Microsoft Internet Explorer 5>" & vbCrLf &
        "Subject: Title" & vbCrLf &
        "Date: Thu, 7 Aug 2014 00:48:31 -0500" & vbCrLf &
        "MIME-Version: 1.0" & vbCrLf &
        "Content-Type: multipart/related;" & vbCrLf &
        vbTab & "type=""text/html"";" & vbCrLf &
        vbTab & "boundary=""----=_NextPart_000_0000_01D02214.354132E0""" & vbCrLf &
        "X-MimeOLE: Produced By Microsoft MimeOLE V6.00.2900.5512" & vbCrLf &
        "" & vbCrLf &
        "This is a multi-part message in MIME format." & vbCrLf &
        "" & vbCrLf &
        "------=_NextPart_000_0000_01D02214.354132E0" & vbCrLf

        doc &= ConvertTextToStream(body, fakeRootPath & "index.html")
        doc &= strings
        doc &= streams & "--"
        savef.WriteLine(doc)
        savef.Flush()
        savef.Close()
    End Sub
    Function DL_resource(ByVal Save_Path As String, ByVal host As String, ByVal path As String, respath As String) As String
        Dim resname As String = path
        If respath = "/" Then respath = ""
        'Check if path is full address.
        If Not Regex.IsMatch(path, "http(s)?://([\w+?\.\w+])+([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?") Then
            path = host & respath & path
        End If

        Dim file_ As String = path
        Dim fname As String = ""
        Dim exten As String = ""

        Dim n As Integer = 0

        file_ = FileNameExt(file_)
        exten = LCase(Ext(file_))

        If exten = ".gif" Or exten = ".jpg" Or exten = ".png" Or exten = ".bmp" Or exten = ".css" Or exten = ".txt" Or exten = ".js" Then
            ' if this is a file and not a web page then download it
            Try
                Do While File.Exists(Save_Path & file_) = True
                    n = n + 1


                    resname = Dirn(resname) & "/" & FileName(resname) & "_" & Trim(Str(n)) & exten
                    file_ = FileName(file_) & "_" & Trim(Str(n)) & exten
                Loop
                If Not File.Exists(Save_Path & file_) Then My.Computer.Network.DownloadFile(path, Save_Path & file_)


                '
                If exten = ".css" Then
                    'AddFileToStream(Save_Path & file_, fakeAssetPath & FileNameExt(resname))
                    DL_Reap_Resource_Children(Save_Path & file_, host, Dirn(resname))
                Else
                    AddFileToStream(Save_Path & file_, fakeAssetPath & FileNameExt(resname))
                End If



                Return fakeAssetPath & FileNameExt(resname)
            Catch ex As Exception
                Return ""
            End Try
        Else
            'if its a link then return full path if needed
            Return ""

        End If
        Return ""
    End Function
    Sub DL_Reap_Resource_Children(ByVal file_ As String, ByVal host_path As String, resPath As String)

        Dim doc As String = File.ReadAllText(file_)
        Dim savename As String = Path.GetDirectoryName(file_)
        'Dim di As String = Split(StrReverse(savename), "\")(0)
        Dim res_name As String = ""
        Dim url As String = ""

        For Each match As Match In Regex.Matches(doc, "url\((?:""|')([a-zA-Z0-9\~\!\@\#\$\%\^\&amp;\*\(\)_\-\=\+\\\/\?\.\:\;\,]*)?(?:""|')\)", RegexOptions.IgnoreCase)
            'Debug.Print(match.Groups(2).Value & " : " & match.Groups(1).Value)
            If Mid(match.Groups(1).Value, 1, 1) = "/" Or Mid(match.Groups(1).Value, 1, 1) = "\" Then
                url = Mid(match.Groups(1).Value, 2, Len(match.Groups(1).Value) - 1)
            Else
                url = match.Groups(1).Value
            End If

            res_name = DL_resource(savename & "\", host_path, url, resPath & "/")

            If res_name <> "" Then doc = Replace(doc, match.Groups(1).Value, res_name.Replace(" ", "%20"))

        Next

        Dim savef As New StreamWriter(file_)
        savef.WriteLine(doc)
        savef.Flush()
        savef.Close()
        AddFileToStream(file_, fakeAssetPath & FileNameExt(file_).Replace(" ", "%20"))
    End Sub
End Class
