export function generateBookmarkletCode(appUrl: string, token: string): string {
  return `javascript:void(function(){var url=encodeURIComponent(window.location.href);window.open('${appUrl}/api/bookmarklet?url='+url+'&token=${token}','stash_bookmarklet','width=400,height=300,scrollbars=no,resizable=no')}())`
}
