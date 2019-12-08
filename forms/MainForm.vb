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
Public Class MainForm

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
        d.FileName = WebBrowser1.DocumentTitle
        d.AddExtension = True
        d.ShowDialog()
        If d.FileName <> "" Then
            Dim fname As String = d.FileName 'System.IO.Path.GetFileNameWithoutExtension(d.FileName)
            If fname <> "" Then
                Try
                    Dim url As String = WebBrowser1.Url.ToString()

                    Dim t = New MHTExporter(url, fname)
                    t.CallBack(AddressOf get_books_completed, "")

                    File.WriteAllText(fname, "<html><title>" & fname & "</title><body><h1>Please Wait. Plugin Being Loaded ...<h1></body></html>")

                    t.start()



                    ''WebBrowser1.Navigate(fname)

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

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
End Class

