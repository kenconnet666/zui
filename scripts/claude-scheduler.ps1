<#
.SYNOPSIS
    延迟指定时间后启动 Claude CLI 交互模式，传入 /loop 命令让它自主执行定时任务。

.DESCRIPTION
    脚本等待指定时间后，在当前终端启动 claude 交互模式并发送 /loop 指令。
    Claude 自己负责规划执行节奏（每半小时检查等），rate limit 时不会退出。

.PARAMETER DelayHours
    启动前等待的小时数。默认 2.5。

.PARAMETER LoopPrompt
    传给 /loop 的任务描述。留空使用默认 roadmap 执行指令。

.EXAMPLE
    .\scripts\claude-scheduler.ps1
    .\scripts\claude-scheduler.ps1 -DelayHours 1
    .\scripts\claude-scheduler.ps1 -LoopPrompt "只执行 Stage 1"
#>

[CmdletBinding()]
param(
    [double]$DelayHours = 2.5,
    [string]$LoopPrompt = ""
)

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$RoadmapPath = ".claude/zui-vue-roadmap.md"

# 默认 prompt
$DefaultPrompt = "查看 $RoadmapPath ，制定本地无人值守执行计划，每半小时看一下如果执行停下来了就继续，注意当前终端不会关闭并且之后不会再回复你，需要你自主决策，遇到困难先搜索本地文件、网络、context7、github等渠道获取信息再决策，不要空想。"
$Prompt = if ($LoopPrompt) { $LoopPrompt } else { $DefaultPrompt }

# 等待
$startTime = (Get-Date).AddHours($DelayHours)
$delaySec = [int]($DelayHours * 3600)

Write-Host ""
Write-Host "  Claude 定时任务已设定" -ForegroundColor Cyan
Write-Host "  将在 $($startTime.ToString('yyyy-MM-dd HH:mm:ss')) 启动（${DelayHours}h 后）" -ForegroundColor Gray
Write-Host "  Ctrl+C 取消" -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds $delaySec

Write-Host "  时间到，启动 Claude CLI..." -ForegroundColor Green
Write-Host ""

Set-Location $ProjectRoot
& claude --permission-mode bypassPermissions "/loop $Prompt"
